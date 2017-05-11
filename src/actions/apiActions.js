import Reflux from 'reflux';
import Immutable from 'immutable';
import debug from 'debug';
import pluralize from 'pluralize';
import makeApiRequest, {makeRequestWithCredentials} from '../utils/makeApiRequest';
import location from '../utils/location';
import Q from 'q';
import _ from 'lodash';

const HttpStatusCode = {
  Unauthorized: 401,
  Forbidden: 403,
  PaymentRequired: 402,
  BadRequest: 400
};

const resources = {
  section: ['', 'crud'],
  catalog: ['', 'crud'],
  view: ['catalog', 'crud'],
  field: ['catalog', 'crud'],
  linkedCatalog: ['catalog', 'r'],
  record: ['catalog', 'crud'],
  "export": ['catalog', 'r'],
  linkedRecord: ['catalog.records', 'r'],
  history: ['', 'cr'],
  comment: ['catalog.record', 'cr'],
  availableRecord: ['catalog.field', 'r'],
  relation: ['catalog.record', 'r'],
  change: ['catalog.record', 'c'],
  right: ['', 'cr'],
  privilege: ['', 'r'],
  filterKey: ['', 'r'],
  user: ['', 'r'],
  board: ['', 'crud'],
  widget: ['board', 'crud'],
  values: ['board.widget', 'r'],
  totals: ['board.widget', 'r']
};

const log = debug('CRM:action:API');

const domains = window.location.host.split('.');

const mainDomain = domains.slice(domains.length - 2).join('.');

const actions = {};

actions.uploadFileRecord = createAsyncAction(function actionHandler(params, data) {
  let resourcePath = '/files';
  makeRequest(this, 'post', resourcePath, params, _.extend({}, params, data), {});
});

actions.removeFileRecord = createAsyncAction(function actionHandler(params, data) {
  let resourcePath = '/files/' + params.fileId;
  makeRequest(this, 'delete', resourcePath, params, _.extend({}, params, data), {});
});

actions.updateFileRecord = createAsyncActionPromise(function actionHandler(params, data) {
  let resourcePath = '/files/' + params.fileId;
  return makeRequest(this, 'patch', resourcePath, params, _.extend({}, params, data), {});
});

actions.getCompanyInfo = createAsyncAction(function(domain){
  makeAuthRequest(this, 'get', '/auth/company');
});

function createAsyncAction(fn, options = {}) {
  let action = Reflux.createAction(_.assign(options, {asyncResult: true, children: ['ready']}));
  action.listen(fn);
  return action;
}

function createAsyncActionPromise(fn, options = {}) {
  let action = Reflux.createAction(_.assign(options, {asyncResult: true}));
  action.listenAndPromise(fn);
  return action;
}

function makeAuthRequest(action, method, path, params, query, data) {
  let resolvedPath = path.split('/').map(key=> {
    if ( key[0] === ':' ) {
      return params[key.slice(1)] || '';
    }

    return key;
  }).join('/');

  makeRequestWithCredentials('', resolvedPath, {
    method: method,
    query: query || {},
    body: data
  }).then(result=> {
    action.completed(result, params, query, data);
  }, err=> {
    log(path, arguments);
    action.failed(err.text);
  });
}

function makeRequest(action, method, path, params, data, query, actionParams) {
  return makeApiRequest(path, {
    method: method,
    query: _.assign({timezoneOffset: -new Date().getTimezoneOffset()}, query),
    body: data
  })
    .then((res) => {
      action.completed(res.body, params, data, query, res, actionParams);
      return res.body;
    }, function (err) {
      let errorText;
      let errorTitle;
      let status = err.status;

      if (status == HttpStatusCode.BadRequest) {
        let response = err.response;
        if (response && response.text) {
          try {
            let data = JSON.parse(response.text);
            if (data.message) {
              if (_.isObject(data.message)) {
                errorText = data.message.text;
                errorTitle = data.message.title;
              } else {
                errorText = data.message;
              }
            }
          } catch (e) {
            errorText = response.text;
          }
        }
      }
      err.title = errorTitle;
      err.text = errorText;
      if (status == HttpStatusCode.Unauthorized) {
        // location
        location.authorize();
      } else if (status == HttpStatusCode.Forbidden) {
        // location.login();
        // todo correct alert
        if (action.failed) {
          action.failed(err, params, data, query, actionParams);
        } else {
          alert('Access denied');
        }
      } else if (status == HttpStatusCode.PaymentRequired) {
        location.paymentRequired();
      } else {
        log(path, arguments);
        action.failed(err, params, data, query, actionParams);
      }
    });
}

_.forEach(resources, (cfg, name)=> {
  _.forEach(cfg[1], op=> {
    let pathCfg = _.compact(cfg[0].split('.')).map(res=> ({path: res, param: res + 'Id'}));
    let requiredParams = pathCfg.map(p=> p.param);
    let mainParamName = name + 'Id';

    function getPath(params, withMainParam) {
      let path = pathCfg.map(p=> pluralize(p.path) + '/' + params[p.param]);
      path.push(pluralize(name));
      if (withMainParam) {
        path.push(params[mainParamName]);
      }
      return path.join('/');
    }

    switch (op) {
      case 'c':
        actions['create' + _.capitalize(name)] = createAsyncAction(function actionHandler(params, data, actionParams) {
          let unsetParams = requiredParams.filter(p=> params[p] == null);
          if (unsetParams.length) {
            return this.failed('unset required params: ' + unsetParams.join(', '));
          }

          let resourcePath = getPath(params);

          makeRequest(this, 'post', resourcePath, params, data, {}, actionParams);
        });
        break;

      case 'r':
        actions['get' + _.capitalize(name)] = createAsyncAction(function actionHandler(params = {}, query = {}, actionParams) {
          let reqParams = requiredParams.slice();
          reqParams.push(mainParamName);
          let unsetParams = reqParams.filter(p=> params[p] == null);
          if (unsetParams.length) {
            return this.failed('unset required params: ' + unsetParams.join(', '));
          }

          let resourcePath = getPath(params, true);

          makeRequest(this, 'get', resourcePath, params, null, query, actionParams);
        });

        // todo: query -> RequestRecords
        actions['get' + _.capitalize(pluralize(name))] = createAsyncAction(function actionHandler(params = {}, query = {}, actionParams) {
          let unsetParams = requiredParams.filter(p=> params[p] == null);
          if (unsetParams.length) {
            return this.failed('unset required params: ' + unsetParams.join(', '));
          }

          let resourcePath = getPath(params);

          makeRequest(this, 'get', resourcePath, params, null, query, actionParams);
        });

        break;

      case 'u':
        actions['update' + _.capitalize(name)] = createAsyncAction(function actionHandler(params, data, actionParams) {
          let reqParams = requiredParams.slice();
          reqParams.push(mainParamName);
          let unsetParams = reqParams.filter(p=> params[p] == null);
          if (unsetParams.length) {
            return this.failed('unset required params: ' + unsetParams.join(', '));
          }

          let resourcePath = getPath(params, true);

          makeRequest(this, 'patch', resourcePath, params, data, {}, actionParams);
        });
        break;

      case 'd':
        actions['delete' + _.capitalize(name)] = createAsyncAction(function actionHandler(params, actionParams) {
          let reqParams = requiredParams.slice();
          reqParams.push(mainParamName);
          let unsetParams = reqParams.filter(p => params[p] == null);
          if (unsetParams.length) {
            return this.failed('unset required params: ' + unsetParams.join(', '));
          }

          let resourcePath = getPath(params, true);

          makeRequest(this, 'del', resourcePath, params, {}, {}, actionParams);
        });
        break;

      default:
        break;
    }
  });
});

if (process.env.NODE_ENV === 'development') {
  window.__apiActions = actions;
}

export default actions;
