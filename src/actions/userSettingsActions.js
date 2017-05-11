import Immutable from 'immutable';
import Reflux from 'reflux';
import debug from 'debug';
import _ from 'lodash'
import makeApiRequest from '../utils/makeApiRequest';
import us_const from '../configs/userSettings';
import us_util from '../utils/userSettings';

const log = debug('CRM:action:UserSettings');


function createAsyncAction(fn, options = {}) {
  let action = Reflux.createAction(_.assign(options, {asyncResult: true}));
  action.listen(fn);
  return action;
}


const actions = {
  /**
   * save visible setting field for the current catalog.
   */
  setFieldVisibility: createAsyncAction(function ({catalogId, fieldId, visible}) {
    let data = {catalogId, fieldId, visible};
    let key = us_util.makeKey(data, us_const.VISIBLE);

    makeApiRequest(`userSettings/${key}`, {method: 'patch', body: {[us_const.VISIBLE]: visible}})
      .then(res => {
        this.completed(res.body);
      }, err=> {
        this.failed(err);
      });
  }),

  /**
   * save width setting field for the current catalog.
   */
  setFieldWidth: createAsyncAction(function ({catalogId, fieldId, width}) {
    let data = {catalogId, fieldId};
    let key = us_util.makeKey(data, us_const.WIDTH);

    makeApiRequest(`userSettings/${key}`, {method: 'patch', body: {[us_const.WIDTH]: width}})
      .then(res => {
        this.completed(res.body);
      }, err=> {
        this.failed(err);
      });
  }),


  /**
   * get all settings for catalogId
   */
  getUserSettingsForCatalog: createAsyncAction(function ({catalogId}) {
    makeApiRequest(`userSettings`, {
      query: {search: us_util.makeKeyForSearch({catalogId})},
      method: 'get'
    })
      .then(res => {
        this.completed(res.body, {catalogId});
      }, err=> {
        this.failed(err);
      });
  }),

  //
  setFieldsOrder: createAsyncAction(function ({catalogId, fieldsOrder}) {
    let data = {catalogId, fieldsOrder};
    let key = us_util.makeKey(data, us_const.FIELDS_ORDER);

    makeApiRequest(`userSettings/${key}`, {method: 'patch', body: {[us_const.FIELDS_ORDER]: fieldsOrder}})
      .then(res => {
        this.completed(res.body, data);
      }, err=> {
        this.failed(err);
      });
  }),

  setSortingRecords: createAsyncAction(function ({catalogId}, data) {
    let params = {catalogId};
    let key = us_util.makeKey(params, us_const.SORTING_RECORDS);

    makeApiRequest(`userSettings/${key}`, {method: 'patch', body: data})
      .then(res => {
        this.completed(res.body, params, data);
      }, err=> {
        this.failed(err);
      });
  })
};


export default actions;
