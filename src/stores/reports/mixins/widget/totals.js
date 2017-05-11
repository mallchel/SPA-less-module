import Immutable from 'immutable';

import {chartDataKeyPrefix} from './valuesPrefix';

const getStoreKey = uid=> [...chartDataKeyPrefix, uid, 'totals'];

export function getTotals({widgetId}, query, {uid}) {
  if (!this.getIn(chartDataKeyPrefix)) {
    this.setIn(chartDataKeyPrefix, Immutable.Map());
  }

  const key = getStoreKey(uid);

  if (!this.getIn(key)) {
    this.setIn(key, Immutable.Map());
  }

  this.setIn([...key, 'loading'], true);

  this.changed();
}

export function getTotalsCompleted(data, {widgetId}, postData, query, res, {uid}) {
  const key = getStoreKey(uid);
  const normalData = data.reduce(function (obj, {key, value}) {
    obj[key] = value;
    return obj;
  }, {});

  this.setIn([...key, 'data'], normalData);
  this.setIn([...key, 'loading'], false);
  this.setIn([...key, 'error'], null);

  this.changed();
}

export function getTotalsFailed(err, {widgetId}, data, query, {uid}) {
  const key = getStoreKey(uid);
  this.setIn([...key, 'error'], err);
  this.setIn([...key, 'loading'], false);

  this.changed();
}
