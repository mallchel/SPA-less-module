import Immutable from 'immutable'
import _ from 'lodash'
import trs from '../getTranslations'
import FIELD_TYPES from '../configs/fieldTypes'
import {PHONE} from '../configs/contactFieldSubTypes'

// const log = require('debug')('CRM:Component:FieldFactory');

const defaultConfigs = {
  [FIELD_TYPES.TEXT]: {type: 'text'},
  [FIELD_TYPES.CONTACT]: {type: PHONE},
  [FIELD_TYPES.NUMBER]: {unit: ''},
  [FIELD_TYPES.DATE]: {time: false, notificationField: null},
  [FIELD_TYPES.DROPDOWN]: {multiselect: false, items: []},
  [FIELD_TYPES.CHECKBOXES]: {items: []},
  [FIELD_TYPES.RADIOBUTTON]: {items: []},
  [FIELD_TYPES.USER]: {multiselect: false},
  [FIELD_TYPES.OBJECT]: {catalogs: []},
  [FIELD_TYPES.FILE]: {multiselect: false}
};

const nameByType = {};
_.forEach(FIELD_TYPES, (id, name)=> nameByType[id] = name.toLowerCase());


export default {
  create(data) {
    data = data || {};

    let Field = {
      __name: 'Field',
      uuid: Math.random(),
      hint: data.hint || '',
      required: data.required,
      id: data.id,
      visible: true, // !!data.visible,
      type: data.type || '',
      apiOnly: data.apiOnly || ''
    };
    if (data.name) {
      Field.name = data.name;
    } else {
      Field.name = Field.type && trs(`fieldTypes.${nameByType[Field.type]}.name`) || '';
    }
    Field.config = _.assign({}, defaultConfigs[Field.type] || {}, data.config || {});

    return Immutable.fromJS(Field);
  }
};
