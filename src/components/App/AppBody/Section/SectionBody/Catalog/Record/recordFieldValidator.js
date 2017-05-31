import FIELD_TYPES from '../../../../../../../configs/fieldTypes'
import _ from 'lodash';

/**
 * Проверка поля на пустоту
 * @param {string} type
 * @param {string} value
 * @returns {boolean}
 */
export function validateField(type, value) {
  let empty = false;
  switch (type) {
    case FIELD_TYPES.GROUP:
    case FIELD_TYPES.PROGRESS:
    case FIELD_TYPES.STARS:
      break;
    case FIELD_TYPES.RADIOBUTTON:
      empty = _.isNull(value) || (value === undefined);
      break;
    case FIELD_TYPES.TEXT:
    case FIELD_TYPES.NUMBER:
      empty = _.isNull(value) || (value === '') || (value === undefined);
      break;
    case FIELD_TYPES.DATE:
      empty = !value;
      break;
    case FIELD_TYPES.CHECKBOXES:
    case FIELD_TYPES.DROPDOWN:
    case FIELD_TYPES.FILE:
    case FIELD_TYPES.USER:
    case FIELD_TYPES.OBJECT:
      empty = (!value || (_.isArray(value) && value.length == 0));
      break;
    case FIELD_TYPES.CONTACT:
      empty = true;
      if (_.isArray(value)) {
        value.map(function (contact) {
          if (contact.contact != '' && contact.contact !== undefined) {
            empty = false;
          }
        });
      }
      break;
  }

  return !empty;
}
