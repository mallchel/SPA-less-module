import _ from 'lodash';
import debug from 'debug';
import Immutable from 'immutable'
import historyActions from '../actions/historyActions';
import apiActions from '../actions/apiActions';
import appState from '../appState'

const log = debug('CRM:Store:historyMixin');

export default {
  limit: 50,

  currentLoading: null,

  loadHistory(catalogId, recordId = 0, request = {}, forceUpdate = false) {
    log('loading history', catalogId, recordId);
    if (recordId) {
      let history = this.getIn(['records', catalogId, recordId, 'history']);
      if (history && (!history.get('allLoaded') || forceUpdate)) {
        let query = {
          catalogId: catalogId,
          recordId: recordId,
          limit: this.limit
        };
        let lastId = history.get('lastId');
        if (lastId && !forceUpdate) {
          query['from'] = lastId;
        }
        if (
          this.currentLoading &&
          this.currentLoading.catalogId == catalogId &&
          this.currentLoading.recordId == recordId &&
          this.currentLoading.lastId == lastId
        ) {
          return true;
        } else {
          this.currentLoading = {
            catalogId, recordId, lastId
          };
        }
        let historyFilter = history.get('filter');
        if (historyFilter) {
          _.merge(query, historyFilter);
        }

        apiActions.getHistories(null, query);
        return !history.get('allLoaded');
      } else {
        return false;
      }
    } else {
      let history = this.get('history');
      if (history && (!history.get('allLoaded') || forceUpdate)) {
        let query = {
          catalogId: catalogId,
          limit: this.limit
        };
        let lastId = history.get('lastId');
        if (lastId && !forceUpdate) {
          query['from'] = lastId;
        }

        let viewId = request.viewId || 0; //this.getIn(['currentCatalog', 'currentViewId']);
        if (viewId) {
          // ID virtual view = 0
          // no filter, no viewId
          if (Number(viewId) != 0) {
            request = { viewId };
          }
        } else {
          let filters = appState.getFiltersForRequest({ catalogId });
          request = { filters };
        }
        if (!_.isEmpty(request)) {
          query['recordsFilter'] = request;
        }


        if (
          this.currentLoading &&
          this.currentLoading.catalogId == catalogId &&
          this.currentLoading.lastId == lastId
        ) {
          return true;
        } else {
          this.currentLoading = {
            catalogId, lastId
          };
        }

        let historyFilter = history.get('filter');
        if (historyFilter) {
          _.merge(query, historyFilter);
        }

        apiActions.getHistories(null, query);
        return !history.get('allLoaded');
      } else {
        return false;
      }
    }
  },

  createComment(catalogId, recordId, commentText) {
    log('create comment', catalogId, recordId, commentText);
    // let record = this.getIn(['records', catalogId, recordId]);
    return apiActions.createHistory({}, {
      catalogId: catalogId,
      recordId: recordId,
      type: 'COMMENT',
      payload: {
        message: commentText
      }
    }).then(() => {
      this.setIn(['records', catalogId, recordId, 'history', 'forceReload'], true);
      this.changed();
      return this.loadHistory(catalogId, recordId, {}, true);
    });
  },

  clearHistory(catalogId, recordId = null) {
    let object;
    if (recordId) {
      object = this.getIn(['records', catalogId, recordId, 'history']);
    } else {
      object = this.get('history');
    }

    object = object.set('allLoaded', false);
    object = object.set('forceReload', false);
    object = object.set('loading', false);
    object = object.set('lastId', null);
    object = object.set('items', []);

    if (recordId) {
      this.setIn(['records', catalogId, recordId, 'history'], object);
    } else {
      this.set('history', object);
    }

    this.changed();
  },

  setFilter(filter, data) {
    if (data.recordId) {
      //История для одной записи
      let history = this.getIn(['records', data.catalogId, data.recordId, 'history']);
      history = this._setFilterToObject(history, filter);
      this.setIn(['records', data.catalogId, data.recordId, 'history'], history);
      historyActions.loadHistory(data.catalogId, data.recordId, {}, true);

    } else {

      //История для каталога
      let history = this.get('history');
      history = this._setFilterToObject(history, filter);
      this.set('history', history);
      historyActions.loadHistory(data.catalogId, 0, {}, true);
    }
  },

  _setFilterToObject(object, filter) {
    if (object) {
      object = object.set('filter', filter);
      object = object.set('items', []);
      object = object.set('loading', false);
      object = object.set('forceReload', true);
      object = object.set('allLoaded', false);
    }
    return object;
  },

  getHistories(params, data) {
    if (data.recordId) {
      //История для одной записи
      let history = this.getIn(['records', data.catalogId, data.recordId, 'history']);
      if (history) {
        history = history.set('loading', true);
        history = history.set('loadError', null);
        this.setIn(['records', data.catalogId, data.recordId, 'history'], history);
        this.changed();
      }
    } else {

      //История для каталога
      let history = this.get('history');
      if (history) {
        history = history.set('loading', true);
        history = history.set('loadError', null);
        this.set('history', history);
        this.changed();
      }
    }
  },

  getHistoriesCompleted(result, params, data, query) {
    result = result || [];
    if (query.recordId) {
      //История для рекорда
      let history = this.getIn(['records', query.catalogId, query.recordId, 'history']);
      if (!history) { return; }
      history = this._updateMergeHistory(history, query.limit, result);
      this.setIn(['records', query.catalogId, query.recordId, 'history'], history);
    } else {

      //История для каталога
      let history = this.get('history');
      if (!history) { return; }
      history = this._updateMergeHistory(history, query.limit, result);
      this.set('history', history);
    }
    this.currentLoading = null;
    this.changed();
  },

  /**
   * @internal
   * @param object
   * @param limit
   * @param result
   * @returns {*}
   */
  _updateMergeHistory(object, limit, result) {
    let lastId = object.get('lastId', null);
    let historyForceReload = object.get('forceReload', false);
    let newIds = {};
    let history;

    result.forEach((h) => {
      newIds[h.id] = true;
    });

    // если это не апдейт истории, то последний полученный результат нужно запомнить как крайний
    if (result.length && !historyForceReload) {
      lastId = _.last(result).id;
    }

    history = object.get('items') || new Immutable.List();
    history = history.filter((h) => !newIds[h.get('id')]);
    // смердживаем старую и новую историю и рассортировываем ее в правильном порядке
    history = Immutable.fromJS(result).concat(history);
    history = history.sort((a, b) => b.get('id') - a.get('id'));

    // у нас на руках полная история
    let allLoaded = false;
    if (result.length < limit) {
      allLoaded = true;
    }

    object = object.set('items', history);
    object = object.set('loading', false);
    object = object.set('forceReload', false);
    object = object.set('allLoaded', allLoaded);

    if (lastId) {
      object = object.set('lastId', lastId);
    }
    object = object.set('loadError', null);

    return object;
  },

  getHistoriesFailed(e, params, data, query) {
    if (query.recordId) {
      let history = this.getIn(['records', query.catalogId, query.recordId, 'history']);
      if (history) {
        history = history.set('loading', false);
        history = history.set('loadError', true);
        this.setIn(['records', query.catalogId, query.recordId, 'history'], history);
        this.changed();
      }
    } else {

      let history = this.get('history');
      if (history) {
        history = history.set('loading', false);
        history = history.set('loadError', true);
        this.set('history', history);
        this.changed();
      }
    }
  }
};
