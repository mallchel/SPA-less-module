import Reflux from 'reflux';
import _ from 'lodash';

const log = require('debug')('CRM:Action:editorActions');

const actions = Reflux.createActions({
  'dropField': {},
  'removeField': {},
  'changeFieldConfig': {sync: true},
  'setFieldName': {},
  'setFieldRequired': {},
  'setFieldApiOnly': {},
  'setFieldHint': {},
  'setCatalogIcon': {},
  'setCatalogName': {}
});

_.forEach(actions, (act, name)=> {
  act.preEmit = function preEmit(...args) {
    log(name, args);
  };
});

export default actions;
