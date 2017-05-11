import Immutable from 'immutable';

import {chartDataKeyPrefix} from './valuesPrefix';

const getStoreKey = uid=> [...chartDataKeyPrefix, uid, 'values'];

export function getValues({widgetId}, query, {uid}) {
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

export function getValuesCompleted(data, {widgetId}, postData, query, res, {uid}) {
  const key = getStoreKey(uid);
  this.setIn([...key, 'data'], data);
  this.setIn([...key, 'loading'], false);
  this.setIn([...key, 'error'], null);

  this.changed();
}

export function getValuesFailed(err, {widgetId}, data, query, {uid}) {
  const key = getStoreKey(uid);
  this.setIn([...key, 'error'], err);
  this.setIn([...key, 'loading'], false);

  this.changed();
}

export function clearChartData(uid) {
  this.setIn([...chartDataKeyPrefix, uid], Immutable.Map());
  this.changed();
}
