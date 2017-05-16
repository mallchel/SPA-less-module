import modalsActions from '../actions/modalsActions';

const v1 = {
  record: {
    open: function (catalogId, recordId) {
      modalsActions.openRecordModal(String(catalogId), String(recordId));
    },
    create: function (catalogId) {
      modalsActions.openLinkedRecordCreate(String(catalogId));
    }
  }
};

const api = {v1};

window.bpium = {api};
