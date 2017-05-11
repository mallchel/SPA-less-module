import _ from 'lodash';
import debug from 'debug';
import Reflux from 'reflux';
import makeApiRequest from '../utils/makeApiRequest';

// const log = debug('CRM:action:dropDownActions');

function createAsyncAction(fn, options = {}) {
  let action = Reflux.createAction(_.assign(options, { asyncResult: true }));
  action.listen(fn);
  return action;
}

const TYPES = {
  CATALOGS: 'catalogs',
  USERS: 'users',
  LINKED_OBJECTS: 'linkedObjects',
  SUBJECTS: 'subjects',
  LINKED_OBJECTS_WITH_FILTERS: 'linkedObjectsWithFilters'

};

const actions = {};

const dropdownHandlers = {
  [TYPES.CATALOGS]: function(...args) {
    makeApiRequest('catalogs?withRightViews=1')
      .then(res=> {
        let catalogs = [];
        res.body.map(catalog => {
          catalogs.push({
            key:  catalog.id,
            text: catalog.name,
            icon: catalog.icon
          });
          if (catalog.views) {
            catalog.views.map(view => {
              catalogs.push({
                key: 'view:' + view.id,
                text: catalog.name + ' / ' + ((view.originName) ? view.originName : view.name),
                icon: catalog.icon
              });
            });
          }
        });
        this.completed(TYPES.CATALOGS, catalogs, ...args);
      }, err=> {
        this.failed(err, TYPES.CATALOGS);
      });
  },

  [TYPES.USERS]: function(...args) {
    makeApiRequest('users')
      .then(res=> {
        this.completed(TYPES.USERS, res.body);
      }, err=> {
        this.failed(err, TYPES.USERS);
      });
  },

  [TYPES.LINKED_OBJECTS]: function(params) {
    makeApiRequest('catalogs/' + params.catalogId + '/fields/' + params.fieldId + '/availableRecords',
      {query: {title: params.title}})
      .then(res=> {
        this.completed(TYPES.LINKED_OBJECTS, res.body);
      }, err=> {
        this.failed(err, TYPES.LINKED_OBJECTS);
      });
  },

  [TYPES.SUBJECTS]: function(params) {
    let opts;
    let title = params && params.title;

    if ( title ) {
      opts = {query: {title: params.title}};
    }

    makeApiRequest('availableRightSubjects', opts)
      .then(res=> {
        this.completed(TYPES.SUBJECTS, res.body.map(c=> {
          return {
            key: c.userAttr + ':' + c.catalogId + ':' + c.recordId,
            text: c.recordTitle,
            icon: c.catalogIcon,
            subject: c
          };
        }), params);
      }, err=> {
        this.failed(err, TYPES.SUBJECTS);
      });
  },

  [TYPES.LINKED_OBJECTS_WITH_FILTERS]: function(params) {
    makeApiRequest('catalogs/' + params.catalogId + '/fields/' + params.fieldId + '/availableFilterRecords',
      {query: {title: params.title}})
      .then(res=> {
        this.completed(TYPES.LINKED_OBJECTS_WITH_FILTERS, res.body);
      }, err=> {
        this.failed(err, TYPES.LINKED_OBJECTS_WITH_FILTERS);
      });
  }
};

actions.clearDropdownItems = Reflux.createAction({});

actions.loadDropdownItems = createAsyncAction(function(type, ...args) {
  if ( !dropdownHandlers[type] ) {
    throw new Error(`No dropdownHandlers for type '${type}'`);
  }

  dropdownHandlers[type].apply(this, args);
});

export default actions;
