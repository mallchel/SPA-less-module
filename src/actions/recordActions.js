import Reflux from 'reflux';
import _ from 'lodash';

const log = require('debug')('CRM:Action:recordActions');

let recordActions = Reflux.createActions({
  openLinkedRecordModal: {},
  generateNewRecord: {},
  updateRecordValue: {sync: true},

  requestForRecords: {sync: true},
  requestForExportRecords: {sync: true},

  validateAndSaveRecord: {sync: true},
  updateErrorFields: {},
  clearErrorField: {},
  clearErrors: {},
  moveFocusToError: {},

  cloneRecord: {},
  shouldUpdateProcess: {sync: true}
});

_.forEach(recordActions, (act, name)=> {
  act.preEmit = function preEmit(...args) {
    log(name, args);
  };
});

export default recordActions;
