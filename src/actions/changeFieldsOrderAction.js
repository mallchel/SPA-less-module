import Reflux from 'reflux';
const log = require('debug')('CRM:Action:changeFieldsOrderAction');
const changeCatalogsOrderAction = Reflux.createAction();

changeCatalogsOrderAction.preEmit = function(catalogId, itemIndex, newIndex) {
  log(`emit, catalogId=${catalogId} itemIndex=${itemIndex}, newIndex=${newIndex}`);
};

export default changeCatalogsOrderAction;
