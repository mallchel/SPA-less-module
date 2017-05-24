import _ from 'lodash';
import FieldTypes from '../configs/fieldTypes';
import appState from '../appState';

export default {
  /*
   * Приводит конфиг path в формат ['{some}', '{1}', '{some}']
   *
   * @path {catalogId, fieldId}
   *
   * @returns ['catalogs', '{catalogId}', 'filters', 'fields', '{fieldId}']
   */
  getViewFilterPath({ catalogId, viewId, fieldId}) {

    if ( Number(viewId) === 0 ) {
      viewId = "$new";
    }
    return ['catalogs', catalogId, 'views', viewId, 'filters', fieldId];
  },

  // getCatalogFieldPath(path, catalogId) {
  //   return ['catalogs', catalogId, 'views', 'filters', 'fields', path.fieldId];
  // },

  // getCatalogFields(catalogId) {
  //   // return ['currentCatalog', 'filters', 'fields'];
  //   return ['catalogs', catalogId, 'views', 'filters', 'fields'];
  // },

  /**
   * @param type field
   * @param value
   */
  filterRequestByFieldType(value, type) {
    switch (type) {
      case FieldTypes.TEXT:
      case FieldTypes.NUMBER:
      case FieldTypes.CONTACT:
      case FieldTypes.DATE:
      case FieldTypes.PROGRESS:
      case FieldTypes.STARS:
      case FieldTypes.DROPDOWN:
      case FieldTypes.CHECKBOXES:
      case FieldTypes.RADIOBUTTON:
        return value;

      case FieldTypes.USER:
        return value.map(_ => _.id);
      case FieldTypes.OBJECT:
        return value.map(_ => {
          return { "recordId": _.recordId, "catalogId": _.catalogId };
        });

      default:
        return {};
    }
  },

  getFiltersForRequest(filters, fields) {
    // code moved from stores/filtersMixin.js
    let result = [];
    for (let key in filters) {
      if (filters.hasOwnProperty(key)) {
        let value = filters[key];

        let fieldFromCatalog = fields.find(f => f.get('id') == key);
        if (!fieldFromCatalog) {
          console.warn('not found field "%s" for filter', key);
        }
        let type = fieldFromCatalog && fieldFromCatalog.get('type');

        result.push({
          fieldId: key,
          value: this.filterRequestByFieldType(value, type)
        });
      }
    }
    return result;
  }
}
