import Immutable from 'immutable'
import _ from 'lodash'

export default {
  create(data = {}) {
    var record = {};
    record.__name = 'Record';
    record._createTime = Date.now();

    record.id = data.id;
    record.isNew = data.isNew;
    record.isDefaultReceived = !record.isNew;
    record.index = data.index;
    record.title = data.title;
    record.values = data.values || this.getEmptyValues(data.fields);
    record.originValues = record.values;
    record.privilegeCode = data.privilegeCode;
    // record.fields = data.fields;
    record.fieldPrivilegeCodes = data.fieldPrivilegeCodes;
    record.history = {};
    record.errors = {};

    record.updateProcesses = {
      should: false,
      count: 0,
      fields: {}
    };

    return Immutable.fromJS(record);
  },

  getEmptyValues(fields) {
    let values = {};
    if (fields) {
      _.forEach(fields, function (field) {
        let fieldId = field.id;
        if (field.config && field.config.defaultValue && !values[fieldId]) {
          values = _.merge(values, { [fieldId]: field.config.defaultEmptyValue });
        }
      });
    }
    return values;
  }
};
