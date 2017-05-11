import Reflux from 'reflux';
const log = require('debug')('CRM:Action:changeCatalogsOrderAction');
const changeCatalogsOrderAction = Reflux.createAction();

changeCatalogsOrderAction.preEmit = function(itemIndex, newIndex) {
  log(`emit, itemIndex=${itemIndex}, newIndex=${newIndex}`);
};

export default changeCatalogsOrderAction;
