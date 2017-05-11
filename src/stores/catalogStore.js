import Reflux from 'reflux';
import debug from 'debug';
import Guid from 'guid';
import Immutable from 'immutable';

import router from '../router';
import CatalogFactory from '../models/CatalogFactory';

const log = debug('CRM:Store:catalogStore');

const catalogStore = Reflux.createStore({
  listenables: [apiActions],
  init() {
    this.name = 'catalogStore';

  },




});

window.catalogStore = catalogStore;

export default catalogStore;
