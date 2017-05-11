import applyHooksResult from './applyHooksResult';

function createChange({catalogId}, query, {recordId, fieldId}) {
  this.mergeIn(['records', catalogId, recordId, 'updateProcesses', 'fields', fieldId], {
    inProcess: true,
    shouldProcess: false
  });

  this.changeIn(['records', catalogId, recordId, 'updateProcesses', 'count'], k=> k + 1);
  this.setIn(['records', catalogId, recordId, 'updateProcesses', 'should'], false);

  this.changed();
}

function createChangeCompleted(body, {catalogId}, data, query, res, {recordId, fieldId}) {
  this.mergeIn(['records', catalogId, recordId, 'updateProcesses', 'fields', fieldId], {inProcess: false});

  this.changeIn(['records', catalogId, recordId, 'updateProcesses', 'count'], k=> k - 1);

  applyHooksResult(body, this, {catalogId, recordId});
  this.changed();
}

function createChangeFailed(err, {catalogId}, data, query, {recordId, fieldId}) {
  this.mergeIn(['records', catalogId, recordId, 'updateProcesses', 'fields', fieldId], {inProcess: false});

  this.changeIn(['records', catalogId, recordId, 'updateProcesses', 'count'], k=> k - 1);

  this.changed();
}

export default {
  createChange,
  createChangeCompleted,
  createChangeFailed
}
