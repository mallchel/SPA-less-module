import Reflux from 'reflux'
import _ from 'lodash'
import qs from 'qs'
import debug from 'debug'
import recordActions from '../actions/recordActions'
import apiActions from '../actions/apiActions'

import UserSettingsStore from './UserSettingsStore'
import AppState from '../appState'

import DEFAULTS from '../configs/reccords'

import { API_PREFIX } from '../configs/reccords'

const log = debug('CRM:Store:RequestRecordStore');

const RequestRecordStore = Reflux.createStore({
  init() {
    this.listenTo(recordActions.requestForRecords, this.requestForRecords);
    this.listenTo(recordActions.requestForExportRecords, this.requestForExportRecords);
    this.listenTo(UserSettingsStore, (store, __, params) => {
      this.requestForRecords(params.catalogId);
    });

    // need pass getRecords without debounce.
    this.$getRecordsDebounce = _.debounce(apiActions.getRecords, 200);
  },

  // aggregation action.
  requestForRecords(catalogId, request = {}) {
    if (!catalogId) {
      throw new Error('Undefined catalogId for request records!');
    }
    let sortParams = this.getSortParams(catalogId);
    request.searchText = AppState.getSearchText(catalogId);

    let { viewId = 0 } = request;

    if (AppState.getIn(['catalogs', catalogId, 'views', viewId, 'filtersChanged']) || Number(viewId) === 0 || viewId === '$new') {
      delete request.viewId;
      _.extend(request, this.getFilterParams(catalogId, viewId));
    }

    _.extend(request, sortParams);

    //limit of records
    request.limit = DEFAULTS.RECORDS_LIMIT;

    // pass getRecords with the debounce.
    this.$getRecordsDebounce({ catalogId }, request);
  },


  requestForExportRecords({ catalogId, viewId = 0 }, request = {}) {
    if (!catalogId)
      throw new Error('Undefined catalogId for request records!');
    let sortParams = this.getSortParams(catalogId);
    request.searchText = AppState.getSearchText(catalogId);

    if (AppState.getIn(['catalogs', catalogId, 'views', viewId, 'filtersChanged']) || Number(viewId) === 0 || viewId === '$new') {
      delete request.viewId;
      _.extend(request, this.getFilterParams(catalogId, viewId));
    }

    _.extend(request, sortParams);

    //limit of records
    request.limit = DEFAULTS.RECORDS_LIMIT;

    // refactor: !
    // make query on export.
    var querySting = qs.stringify(request);
    let path = API_PREFIX + 'catalogs/' + catalogId + '/exports?' + querySting;
    window.open(path);
    log(path);
  },


  /**
   * @private
   * @param catalogId
   */
  getSortParams(catalogId) {
    let sortingRecordSetting = UserSettingsStore.getSortingRecords({ catalogId });
    let sortField = sortingRecordSetting.get('sortField'),
      sortType = sortingRecordSetting.get('sortType');
    return { sortField, sortType };
  },

  /**
   * @private
   */
  getFilterParams(catalogId, viewId) {
    let filters = AppState.getFiltersForRequest({ catalogId, viewId });
    return {
      filters /*FiltersStore.getFiltersForRequest(catalogId)*/
    };
  },

  /**
   * @return viewId
   */
  // getCurrentViewId() {
  //   return AppState.getIn(['currentCatalog', 'currentViewId']);
  // }
});


export default RequestRecordStore;
