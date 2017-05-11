import Reflux from 'reflux';
import _ from 'lodash';

const log = require('debug')('CRM:Action:modalsActions');

const actions = Reflux.createActions({
  openAccessModal: {sync: true},
  openViewAccessModal: {sync: true},
  openViewFieldRightsModal: {sync: true},
  openViewInputModalEdit: {sync: true},
  openViewInputModal: {sync: true},

  openRecordModal: {sync: true},
  openLinkedRecordCreate: {sync: true},
  openRelatedRecordCreate: {sync: true},
  closeRecordModal: {sync: true},
  returnSelfToParent: {sync: true},

  updateObjectField: {sync: true},

  openImportModal: {sync: true}
});

export default actions;
