import Immutable from 'immutable'
import Reflux from 'reflux'
import _ from 'lodash'

import apiActions from './actions/apiActions'
// import routeAction from './actions/routeAction';
import recordActions from './actions/recordActions'
import editorActions from './actions/editorActions'
import sectionActions from './actions/sectionActions'
import dropDownActions from './actions/dropdownActions'
import userSettingsActions from './actions/userSettingsActions'
import viewActions from './actions/viewActions'
import catalogActions from './actions/catalogActions'
import historyActions from './actions/historyActions'
import reportsActions from './actions/reports'
import linkedRecordActions from './actions/linkedRecord'

import UserSettingsStore from './stores/UserSettingsStore';
import RequestRecordStore from './stores/RequestRecordStore'
import ModalStore from './stores/ModalStore';

import { DEFAULT } from './configs/appModes'

const log = require('debug')('CRM:appState');

const storeMixins = [
  require('./stores/appMixin').default,
  // require('./stores/routeMixin'),
  require('./stores/sectionsMixin').default,
  require('./stores/catalogsMixin').default,
  require('./stores/recordsMixin').default,
  require('./stores/editorMixin').default,
  require('./stores/dropdownMixin').default,
  require('./stores/viewsMixin').default,
  require('./stores/filtersMixin').default,
  require('./stores/rightsMixin').default,
  require('./stores/privilegesMixin').default,
  require('./stores/filterKeysMixin').default,
  require('./stores/authMixin').default,
  require('./stores/userMixin').default,
  require('./stores/historyMixin').default,
  require('./stores/reports/mixins').default,
  require('./stores/changesMixin').default,
  require('./stores/linkedRecordMixin').default,
];

let apiHandlers = {};

storeMixins.forEach(m => {
  _.forEach(m, (fn, handlerName) => {
    if (apiHandlers[handlerName] == null) {
      apiHandlers[handlerName] = 0;
    }
    apiHandlers[handlerName]++;
  });
});

let aggregatedHandlers = {};
let originalMixins = storeMixins.slice();

_.forEach(apiHandlers, (count, handlerName) => {
  if (count > 1) {
    log(`Warning! '${handlerName}' fn declared ${count} times`);
    aggregatedHandlers[handlerName] = function (...args) {
      let fns = [];
      originalMixins.forEach(m => {
        _.forEach(m, (fn, fnName) => {
          if (fnName === handlerName) {
            fns.push(fn);
          }
        });
      });
      for (let i = 0; i < fns.length; i++) {
        fns[i].apply(this, args);
      }
    };
  }
});

storeMixins.push(aggregatedHandlers);


const STORAGE_KEY = 'appState';
let clearStorage;

Reflux.StoreMethods.setAppState = function setAppState(st) {
  this.state = st;
};

let state = Immutable.fromJS({
  // route: '',
  route: {},
  prevRoute: '',
  prevRouteParams: {},

  dropType: null,
  dropInfo: null,

  initialDataLoading: false,
  initialDataLoaded: false,

  sections: {},
  sectionCreating: false,
  sectionCreateError: null,
  sectionsLoading: {},
  sectionsLoaded: {},
  sectionsLoadError: {},


  catalogs: {},
  catalogsLoading: false,
  catalogsLoadError: null,

  editingCatalogs: {},

  catalogMapOrder: [],

  currentRecordId: null,
  currentRecordLoading: false,
  currentRecordLoadError: null,

  currentUser: null,
  currentUserLoading: false,

  createCatalogAllowed: null,

  records: {},
  newRecordId: {},

  uploadingFiles: {},

  dropdownCollections: {},
  rights: [],

  privilegeCodesLoading: false,
  privilegeCodesLoaded: false,
  privilegeCodesByResource: {},

  extensions: [],
  modules: [],

  mode: DEFAULT,
  modalsFullScreen: false,

  boards: {
    list: []
  },

  catalogsHistory: {}
});

const appState = Reflux.createStore({
  mixins: storeMixins,
  listenables: [
    sectionActions,
    apiActions,
    recordActions,
    catalogActions,
    editorActions,
    dropDownActions,
    userSettingsActions,
    historyActions,
    reportsActions,
    linkedRecordActions
  ],

  init() {
    // this.listenTo(routeAction, this.onRouteChange);
    this.listen(() => log('changed'));
  },

  registerStore(store) {
    store.setAppState(this);
    this.listenTo(store, () => {
      log(`'${store.name}' triggered change`);
      this.changed();
    });
  },

  getState() {
    return state;
  },

  get(path) {
    return state.get(path);
  },

  getIn(path) {
    return state.getIn(path);
  },

  set(path, val) {
    state = state.set(path, val);
  },

  setState(newState) {
    state = newState;
  },

  setFromJS(path, val) {
    state = state.set(path, Immutable.fromJS(val));
  },

  setIn(path, val) {
    state = state.setIn(path, val);
  },

  changeIn(path, fn) {
    state = state.setIn(path, fn(state.getIn(path)));
  },

  mergeIn(path, val) {
    state = state.mergeIn(path, val);
  },

  mergeDeepIn(path, val) {
    state = state.mergeDeepIn(path, val);
  },

  deleteIn(path) {
    state = state.deleteIn(path);
  },

  changed() {
    // log('changed');
    this.trigger(state);
  },

  saveToStorage() {
    window.localStorage[STORAGE_KEY] = JSON.stringify(state.toJS());
  },

  loadFromStorage() {
    let st;
    try {
      st = JSON.parse(window.localStorage[STORAGE_KEY]);
    } catch (e) {
    }
    if (st) {
      log('set from storage');
      this.setState(Immutable.fromJS(st));
    }
  },

  findById(pathToList, id) {
    let list = this.getIn(pathToList);
    return (list && list.find(o => o.get('id') === id)) || null;
  },

  toJS() {
    return state.toJS();
  },

  clearOnNextReload() {
    clearStorage = true;
  }
});

// if ( __DEV__ ) {
//   appState.loadFromStorage();

//   $(window).on('beforeunload', ()=> {
//     if ( clearStorage ) {
//       delete window.localStorage[STORAGE_KEY];
//     } else {
//       appState.saveToStorage();
//     }
//   });
// }

window.appState = appState;

export default appState;
