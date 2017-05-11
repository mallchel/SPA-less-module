import Reflux from 'reflux';
import _ from 'lodash';

import apiActions from './apiActions';

const log = require('debug')('CRM:Action:userActions');

const actions = {};

actions.getCurrentUser = Reflux.createAction({});
actions.getCurrentUser.listen(function () {
  if (!appState.get('currentUser') && !appState.get('currentUserLoading')) {
    appState.set('currentUserLoading', true);
    apiActions.getUser({userId: 'current'});
  }
});

_.forEach(actions, (act, name)=> {
  act.preEmit = function preEmit(...args) {
    log(name, args);
  };
});

export default actions;
