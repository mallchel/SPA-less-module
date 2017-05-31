import _ from 'lodash';

import Value from '../../popup/data/data/Select/Value';
import Axis from '../../popup/data/data/Select/Axis';

const {getAvailableValues: getValues} = Value.prototype;
const {getAvailableValues: getAxis} = Axis.prototype;

function compare(val1, val2) {
  // to be equal: '' and null
  return (val1 || '') == (val2 || '');
}

function find(array, value) {
  value = value && value.toJS() || {};

  return _.find(array, item=> {
    return compare(item.type, value.type)
      && compare(item.subType, value.subType)
      && compare(item.value, value.value);
  });
}

export default function (widget, fields) {
  const values = getValues(fields);
  const axes = getAxis(fields);

  const value = find(values, widget.get('value'));
  const axis = find(axes, widget.get('axis'));

  let titles = [
    value && value.title,
    axis && axis.title
  ];

  return titles.filter(t=> t).join(' / ');
}
