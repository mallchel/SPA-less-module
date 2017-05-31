import _ from 'lodash';
import assignWith from 'lodash.assignwith';
import Immutable from 'immutable';

import apiActions from '../../../../actions/apiActions';
import reportsActions from '../../../../actions/reports';
import filtersUtils from '../../../../utils/filters';

import mixDataSorting from './dataSorting';
import mixDataLimit from './dataLimiter';

function getQuery(catalog, widget) {
  const query = [
    'value',
    'valueFn',
    'axis',
    'split',
    'recordsType'
  ].reduce(function (obj, key) {
    const widgetValue = widget.getIn([key]);
    obj[key] = _.isObject(widgetValue) ? widgetValue.toJS() : widgetValue;
    return obj;
  }, {});

  query.recordsFilter = getWidgetRecordsFilter(catalog, widget);

  return query;
}

function getCatalogFilter(catalog) {
  const viewId = catalog.get('currentViewId');
  // todo remove virtual view
  if (viewId && viewId !== '0') {
    return {viewId};
  }

  const catalogFilters = catalog.getIn(['filters', 'fields']);
  if (catalogFilters) {
    const filters = filtersUtils.getFiltersForRequest(catalogFilters.toJS(), catalog.get('fields'));
    if (filters) {
      return {filters};
    }
  }
}

function getWidgetRecordsFilter(catalog, widget) {
  const recordsFilter = (widget.get('recordsFilter') || Immutable.Map()).toJS();
  if (recordsFilter.filters) {
    // convert to api format
    recordsFilter.filters = filtersUtils.getFiltersForRequest(recordsFilter.filters, catalog.get('fields'));
  }
  return recordsFilter;
}

function mixRecordsFilter(query, catalog) {
  const catalogFilter = getCatalogFilter(catalog);

  if (!query.recordsFilter) {
    query.recordsFilter = {};
  }

  assignWith(query.recordsFilter, catalogFilter, function (value1, value2, key, obj) {
    if (_.isArray(value1)) {
      return value1.concat(value2);
    }

    if (_.isArray(value2)) {
      return value2.concat(value1);
    }

    if (key === 'viewId') {
      if (value1 && value2) {
        obj.viewIds = [value1, value2];
      }
      return value1 || value2;
    }
  });
}

const getDataMixin = {
  componentWillReceiveProps(props) {
    this.getData(props);
  },

  componentDidMount() {
    this.getData(this.props);
  },

  setVisible(isVisible) {
    this.isVisible = isVisible;
    if (isVisible && this.getDataAfterVisible) {
      this.getData(this.props);
    }
  },

  getData({widget, board, catalog, license}) {
    const boardId = board.get('id');
    const inEditMode = widget.get('inEditMode');
    const widgetId = widget.get('id');

    if (!license && !inEditMode) {
      return;
    }

    if (!widget.get('axis')) {
      return;
    }

    if (!this.isVisible) {
      this.getDataAfterVisible = true;
      return;
    }

    this.getDataAfterVisible = false;

    const params = {boardId, widgetId: !inEditMode && widgetId || 'new'};
    const dataQuery = getQuery(catalog, widget);
    const query = inEditMode ? dataQuery : {};

    mixRecordsFilter(query, catalog);
    mixDataSorting(query, widget, catalog);
    mixDataLimit(query, widget, catalog);

    const newQuery = {params, query, dataQuery, boardUpdateTime: board.get('beginUpdate')};

    if (!_.isEqual(this._lastQuery, newQuery)) {
      const uid = widget.get('uid');
      if (this._lastQuery && !_.isEqual(this._lastQuery.dataQuery, newQuery.dataQuery)) {
        reportsActions.clearChartData(uid);
      }
      this._lastQuery = newQuery;
      this.getDataDebounce({params, query, uid});
    }
  },

  getDataDebounce(...args) {
    if (!this._getDataDebounce) {
      this._getDataDebounce = _.debounce(function ({params, query, uid}) {
        if (!this.isMounted()) {return;}
        apiActions.getValues(params, query, {uid});
        apiActions.getTotals(params, query, {uid});
      }, 200);
    }

    this._getDataDebounce(...args);
  }
};

export default getDataMixin;
