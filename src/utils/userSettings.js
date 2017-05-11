import _ from 'lodash';

const delimiter = '.';
const preparingProcess = [
  ({catalogId}) => {
    return catalogId ? ['catalogs', catalogId] : [];
  },
  ({fieldId}) => {
    return fieldId ? ['fields', fieldId] : [];
  },
  ({filterId}) => {
    return filterId ? ['filters', filterId] : [];
  },
  ({recordId}) => {
    return recordId ? ['records', recordId] : [];
  }
];

export default  {
  delimiter,

  makeObject(str, defVal) {
    let resObj = {};
    let length = str.split(delimiter).length - 1;
    str.split('.').reduce(function (a, b, i) {
      if (length == i) {
        a[b] = defVal;
      } else
        a[b] = {};
      return a[b];
    }, resObj);
    return resObj;
  },

  makeKey(params, type) {
    let res = preparingProcess.map(fn => fn(params).join(delimiter))
      .filter(arr => arr.length)
      .join(delimiter);
    return [res, type].join(delimiter);
  },

  makeKeyForSearch(params) {
    let res = preparingProcess.map(fn => fn(params).join(delimiter))
      .filter(arr => arr.length)
      .join(delimiter);
    return res + delimiter;
  }
}
