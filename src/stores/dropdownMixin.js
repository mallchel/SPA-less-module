import debug from 'debug';
import Immutable from 'immutable';

const log = debug('CRM:Store:dropdownMixin');

const ST_KEY = 'dropdownCollections';

const emptyCol = {
  lifeTime: 0,
  items: []
};

const dropdownMixin = {

  _clearDropdownCollection(type) {
    let col = this.getIn([ST_KEY, type]);
    if ( !col || col.get('items').size !== 0 ) {
      this.setIn([ST_KEY, type], Immutable.fromJS(emptyCol));
      this.changed();
    }
  },

  clearDropdownItems(type) {
    this._clearDropdownCollection(type);
  },

  loadDropdownItems(type) {
    this._clearDropdownCollection(type);
    this.setIn([ST_KEY, type, 'loading'], true);
    this.changed();
  },

  loadDropdownItemsCompleted(type, items, cacheTime = 0) {
    this.setIn([ST_KEY, type], Immutable.fromJS({
      lifeTime: Date.now() + cacheTime,
      items,
      loading: false
    }));
    this.changed();
  }


};

export default dropdownMixin;
