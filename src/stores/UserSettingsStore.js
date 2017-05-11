import Immutable from 'immutable';
import Reflux from 'reflux';
import debug from 'debug';
import _ from 'lodash';
const log = debug('CRM:store:UserSettings');
import userSettingsActions from '../actions/userSettingsActions';
import usUtil from '../utils/userSettings';
import usConst from '../configs/userSettings';


let state = Immutable.fromJS({
  catalogs: {}
});

const userSettingsStore = Reflux.createStore({
  listenables: [userSettingsActions],

  // to mixin.
  changed(params) {
    this.trigger(this, state, params);
    log('changed', params);
  },

  setIn(path, val) {
    state = state.setIn(path, val);
  },

  // getters.
  getVisibilityField(params, defaultValue) {
    let key = usUtil.makeKey(params, usConst.VISIBLE);
    let setting = state.getIn(key.split(usUtil.delimiter));
    if (setting) {
      // get value from setting
      return setting.get(usConst.VISIBLE);
    }
    return defaultValue;
  },

  getFieldsOrder({catalogId}, defaultValue = null) {
    let key = usUtil.makeKey({catalogId}, usConst.FIELDS_ORDER);
    let setting = state.getIn(key.split(usUtil.delimiter));
    if (setting) {
      // get value from setting
      return setting.get(usConst.FIELDS_ORDER).toJS();
    }
    return defaultValue;
  },

  getSortingRecords({catalogId}, defaultValue = Immutable.Map({'sortField': 'id', 'sortType': -1})) {
    let key = usUtil.makeKey({catalogId}, usConst.SORTING_RECORDS);
    let setting = state.getIn(key.split(usUtil.delimiter));
    if (setting) {
      // get value from setting
      return setting;
    }
    return defaultValue;
  },

  getWidthsRecords({catalogId, fieldId}, defaultValue = 90) {
    let key = usUtil.makeKey({catalogId, fieldId}, usConst.WIDTH);
    let setting = state.getIn(key.split(usUtil.delimiter));
    if (setting) {
      // get value from setting
      return setting.get(usConst.WIDTH);
    }
    return defaultValue;
  },

  //|/////////////|
  //|/ actions ///|
  getUserSettingsForCatalog({catalogId}) {
    log('start request for user settings for catalog %s', catalogId);
  },

  /**
   */
  getUserSettingsForCatalogCompleted(data, params) {
    // process all settings for catalog.
    _.forEach(data, s => {
      let obj = usUtil.makeObject(s.key, s.value);
      state = state.mergeDeep(obj);
    });
  },

  setFieldVisibility(params) {
    let visible = params[usConst.VISIBLE];
    let key = usUtil.makeKey(params, usConst.VISIBLE);
    this.setIn(key.split(usUtil.delimiter), Immutable.fromJS({[usConst.VISIBLE]: visible}));

    this.changed(params);
  },

  setFieldWidth(params) {
    let width = params[usConst.WIDTH];
    let key = usUtil.makeKey(params, usConst.WIDTH);
    this.setIn(key.split(usUtil.delimiter), Immutable.fromJS({[usConst.WIDTH]: width}));

    this.changed(params);
  },

  setFieldVisibilityFailed() {
    // TODO: revert visibility if possible, or download fields
  },

  setFieldsOrder(params) {
    let fieldOrder = params[usConst.FIELDS_ORDER];
    let key = usUtil.makeKey(params, usConst.FIELDS_ORDER);
    this.setIn(key.split(usUtil.delimiter), Immutable.fromJS({[usConst.FIELDS_ORDER]: fieldOrder}));

    this.changed(params);
  },

  setSortingRecords(params, data) {
    let key = usUtil.makeKey(params, usConst.SORTING_RECORDS);
    this.setIn(key.split(usUtil.delimiter), Immutable.fromJS(data));

    log(state.toJS());

    this.changed(params);
  }
});

export default userSettingsStore;
