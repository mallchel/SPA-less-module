import _ from 'lodash';
import unset from 'lodash.unset';
import apiActions from '../actions/apiActions';

const records = {};

export default {
  updateRecordLinkedRecord(record, linkedRecord) {
    const {catalogId, recordId, fieldId} = record;
    const {catalogId: linkedCatalogId, recordId: linkedRecordId} = linkedRecord;

    _.set(records, [linkedCatalogId, linkedRecordId], {catalogId, recordId, fieldId});

    apiActions.getRecord({catalogId: linkedCatalogId, recordId: linkedRecordId});
  },

  getRecordCompleted({title}, {catalogId, recordId}) {
    const recordToUpdate = _.get(records, [catalogId, recordId]);
    if (recordToUpdate) {
      const {catalogId: catalogIdToUpdate, recordId: recordIdToUpdate, fieldId} = recordToUpdate;
      const valueKey = ['records', catalogIdToUpdate, recordIdToUpdate, 'values', fieldId];
      const value = this.getIn(valueKey);
      const newValue = value.map(linkedRecord=> {
        if (linkedRecord.get('catalogId') == catalogId && linkedRecord.get('recordId') == recordId) {
          return linkedRecord.set('recordTitle', title);
        }

        return linkedRecord;
      });
      this.setIn(valueKey, newValue);
      unset(records, [catalogId, recordId]);
      this.changed();
    }
  }
}
