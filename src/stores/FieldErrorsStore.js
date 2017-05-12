import Reflux from 'reflux';
import _ from 'lodash';

import recordActions from '../actions/recordActions'
import AppState from '../appState';

const log = require('debug')('CRM:Store:focusStore');

export default Reflux.createStore({
  listenables: [recordActions],
  errors : [],
  updateErrorFields (catalogId, recordId, errors) {
    if (this.errors[catalogId] === undefined) {
      this.errors[catalogId] = [];
    }
    this.errors[catalogId][recordId] = errors;
    let event = {
      event: 'onErrors', errors: this.errors
    };
    this.trigger(event);
    recordActions.moveFocusToError(catalogId, recordId);
  },
  clearErrorField(catalogId, recordId, fieldId) {
    if (this.errors && this.errors[catalogId] && this.errors[catalogId][recordId]) {
      let errors = [];
      _.forEach(this.errors[catalogId][recordId], (error) => {
        if (error.fieldId != fieldId) {
          errors.push(error);
        }
      });
      this.errors[catalogId][recordId] = errors;
      let event = {
        event: 'onErrors', errors: this.errors
      };
      this.trigger(event);
    }
  },
  clearErrors({catalogId}) {
    //if (!this.errors[catalogId]) {
      this.errors[catalogId] = [];
    //}
  },
  moveFocusToError(catalogId, recordId) {
    let errors = this.errors[catalogId][recordId];
    let firstElement = _.head(errors);
    if (firstElement) {
      let event = {
        event: 'onFocus', catalogId: catalogId, recordId: recordId, fieldId: parseInt(firstElement.fieldId)
      };
      this.trigger(event);
    }
  }
});