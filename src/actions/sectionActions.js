import Reflux from 'reflux';
import _ from 'lodash';

const log = require('debug')('CRM:Action:sectionActions');

const actions = Reflux.createActions({
  clearSectionUpdateError: {},
  clearSectionDeleteError: {}
});

_.forEach(actions, (act, name)=> {
  act.preEmit = function preEmit(...args) {
    log(name, args);
  };
});

export default actions;
