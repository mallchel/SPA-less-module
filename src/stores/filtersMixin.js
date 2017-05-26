import debug from 'debug';
import _ from 'lodash';
import Immutable from 'immutable'
// import apiActions from '../actions/apiActions';
import filterActions from '../actions/filterActions';
import filtersUtil from '../utils/filters';
import recordActions from '../actions/recordActions';
// import historyActions from '../actions/historyActions';

const log = debug('CRM:store:filtersMixin');

export default {

  init() {
    this.listenToMany(filterActions);
  },

  /**
   * @param params Object(fieldId, catalogId)
   * @param value Any
   */
  updateFieldFilter(params, value) {
    if (!_.isEmpty(value)) {
      this.$setFieldFilter(params, value)
    } else {
      this.$removeFieldFilter(params);
    }

    // switch (this.getIn(['routeParams', 'tabId'])) {
    //   case 'records':
    //     recordActions.requestForRecords(catalogId);
    //     break;
    //   case 'history':
    //     historyActions.clearHistory(catalogId);
    //     historyActions.loadHistory(catalogId);
    //     break;
    //   case 'reports':
    //     break;
    // }
  },

  searchByText(catalogId, searchText) {
    // save search text to store.
    this.setIn(['catalogs', catalogId, 'searchText'], searchText);
    recordActions.requestForRecords(catalogId);
  },

  $setFieldFilter(path, value) {
    //log('Set field', value, path);
    this.setIn([...filtersUtil.getViewFilterPath(path), 'value'], Immutable.fromJS(value));
  },

  $removeFieldFilter(path) {
    this.deleteIn(filtersUtil.getViewFilterPath(path));

    log('FILTER_STORE remove', this.toJS());
  },

  // removeAllFilters(isChange = false, catalogId) {
  //   this.deleteIn(filtersUtil.getCatalogFields(catalogId));
  //   if (isChange) {
  //     this.changed();
  //   }
  // },

  getCatalogFilters({ catalogId }) {
    if (this.getIn(['catalogs', catalogId, 'filters'])) {
      return this.getIn(filtersUtil.getCatalogFields());
    } else {
      return Immutable.List();
    }
  },

  getFiltersForRequest({ catalogId }) {
    let catalogFilters = this.getCatalogFilters({ catalogId });
    if (catalogFilters) {
      catalogFilters = catalogFilters.toJS();
      return filtersUtil.getFiltersForRequest(catalogFilters, this.getIn(['catalogs', catalogId, 'fields']));
    } else {
      log('Filters are empty. Nothing happens.');
      return [];
    }
  },

  getSearchText(catalogId) {
    return this.getIn(['catalogs', catalogId, 'searchText']);
  },

  // -> apiActions
  // todo: refactor!!!!
  // change FilterStore through actionsFilter
  // - removeAllFilterCatalog
  // - $setFieldFilter
  //getViewCompleted(view, {viewId, catalogId}) {
  //  // merge view.filter into values.
  //  this.removeAllFilterCatalog(catalogId);
  //  if (view.filters) {
  //    _.map(view.filters, (filter) => {
  //      let fieldId = filter.attr;
  //      // get fieldType by fieldId from current catalog.
  //      let fieldType = Appthis.getIn(['currentCatalog', 'fields'])
  //        .find(f => fieldId == f.get('id'))
  //        .get('type');
  //      this.$setFieldFilter({catalogId, fieldId}, {
  //        type: fieldType,
  //        value: filter.value});
  //    });
  //  }
  //  let filters = this.getFiltersForRequest(catalogId);
  //  this.trigger({catalogId}, filters);
  //},

};

