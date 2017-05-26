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

    let { viewId } = request;
    viewId = viewId || this.getCurrentViewId();

    if (viewId) {
      // ID virtual view = 0
      // no filter, no viewId
      request = Number(viewId) == 0 ?
        _.extend(request, sortParams) :
        _.extend(request, { viewId }, sortParams);
    } else {
      let filterParams = this.getFilterParams(catalogId);
      request = _.extend(request, sortParams, filterParams);
    }

    //limit of records
    request.limit = DEFAULTS.RECORDS_LIMIT;

    // pass getRecords with the debounce.
    this.$getRecordsDebounce({ catalogId }, request);
  },


  requestForExportRecords(catalogId, request = {}) {
    if (!catalogId)
      throw new Error('Undefined catalogId for request records!');

    let sortParams = this.getSortParams(catalogId);
    request.searchText = AppState.getSearchText(catalogId);

    let viewId = this.getCurrentViewId();

    if (viewId) {
      // ID virtual view = 0
      // no filter, no viewId
      request = Number(viewId) == 0 ?
        _.extend(request, sortParams) :
        _.extend(request, { viewId }, sortParams);
    } else {
      let filterParams = this.getFilterParams(catalogId);
      request = _.extend(request, sortParams, filterParams);
    }

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
  getFilterParams(catalogId) {
    let filters = AppState.getFiltersForRequest({ catalogId });
    return {
      filters /*FiltersStore.getFiltersForRequest(catalogId)*/
    };
  },

  /**
   * @return viewId
   */
  getCurrentViewId() {
    return AppState.getIn(['currentCatalog', 'currentViewId']);
  }
});


export default RequestRecordStore;
