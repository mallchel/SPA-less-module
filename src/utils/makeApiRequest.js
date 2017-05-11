import Q from 'q';
import qs from 'qs';
import request from 'superagent';
import _ from 'lodash';

import {API_PREFIX} from '../configs/reccords';

const log = require('debug')('makeApiRequest');

function getDefaultOptions() {
  return {
    method: 'get',
    query: {},
    headers: {
      // 'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: null
  };
}

export function makeRequestWithCredentials(prefix, path, opts = {}) {
  if ( _.isObject(path) ) {
    opts = path;
    path = opts.path;
  }
  let defer = Q.defer();
  let defaultOptions = getDefaultOptions();
  let method = opts.method || defaultOptions.method;
  let query = _.assign({}, defaultOptions.query, opts.query || {});
  let headers = _.assign({}, defaultOptions.headers, opts.headers || {});

  if ( method === 'delete' ) {
    method = 'del';
  }

  if ( path[0] === '/' ) {
    path = path.slice(1);
  }
  log(method + ' ' + path, opts.body);

  let r = request[method](prefix + path)
    .withCredentials()
    .set(headers)
    .query(qs.stringify(query));

  if ( opts.body ) {
    r = r.send(opts.body);
  }

  r.end((err, res)=> {
    if ( err ) {
      log('error ' + path, err.status ? err.status + ' ' + err.response.statusMessage : err );
      return defer.reject(err);
    }
    log('success ' + path);
    defer.resolve(res);
  });

  return defer.promise;

}

export default function makeApiRequest(path, opts) {
  return makeRequestWithCredentials(API_PREFIX, path, opts);
}
