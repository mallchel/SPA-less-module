import Immutable from 'immutable'
import _ from 'lodash'

function queryToObject(query) {
  let object;

  if (query.sectionId) {
    object = {
      sectionId: query.sectionId
    }
  } else if (query.viewId) {
    object = {
      viewId: query.viewId
    }
  } else if (query.recordId) {
    object = {
      recordId: query.recordId,
      catalogId: query.catalogId
    }
  } else if (query.catalogId) {
    object = {
      catalogId: query.catalogId
    }
  }

  return object;
}

export default {
  updateRightObject(object, loadingComplete, rules = null) {
    let rightsCollection = this.getIn(['rights']);
    let rightsObjectIndex = rightsCollection.findIndex(ro => {
      return _.isEqual(ro.getIn(['object']).toJS(), object);
    });

    if (rightsObjectIndex > -1) {
      this.setIn(['rights', rightsObjectIndex, 'loadingComplete'], loadingComplete);

      if (rules) {
        this.setIn(['rights', rightsObjectIndex, 'rules'], Immutable.fromJS(rules));
      }
    } else {
      rightsCollection = rightsCollection.push(Immutable.fromJS({
        object,
        rules,
        loadingComplete
      }));
      this.setIn(['rights'], rightsCollection);
    }
  },

  getRights(params, query) {
    let object = queryToObject(query);

    this.updateRightObject(object, false);

    this.changed();
  },

  getRightsCompleted(rights, params, data, query) {
    // if from server returned empty list
    if (!rights.length) {
      let object = queryToObject(query);

      // if request contains object filter, then in object no rules
      // else no objects with rules
      if (_.keys(object).length) {
        rights = [{
          object,
          rules: []
        }];
      } else {
        this.setSize(['rights'], 0);
        return;
      }
    }
    rights.forEach(rightObj => {
      this.updateRightObject(rightObj.object, true, rightObj.rules || []);
    });

    this.changed();
  },

  createRightCompleted(result, params, data) {
    let rightObj = Immutable.fromJS(data).toJS();
    this.updateRightObject(rightObj.object, true, rightObj.rules || []);
  }
}
