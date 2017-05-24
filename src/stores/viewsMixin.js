import CatalogFactory from '../models/CatalogFactory';
import ViewFactory from '../models/ViewFactory';
import debug from 'debug';
import Immutable from 'immutable';
import router from '../router';
import apiActions from '../actions/apiActions';
import modalsActions from '../actions/modalsActions';
import viewActions from '../actions/viewActions';
import recordActions from '../actions/recordActions';
import historyActions from '../actions/historyActions';
import trs from '../getTranslations';
import _ from 'lodash';
import antiCapitalize from '../utils/antiCapitalize';

import appState from '../appState'

const log = debug('CRM:viewsMixin');
var init = false;

let createView = _.debounce(function (catalogId, data) {
  apiActions.createView({ catalogId }, data);
}, 1);
let saveDebouncedView = _.debounce(function (catalogId, viewId, data) {
  apiActions.updateView({ catalogId, viewId }, data);
}, 1);

export default {

  init() {
    if (init) return;
    //// view mixin
    //this.listenTo(viewActions.selectView, this.selectView);
    //this.listenTo(viewActions.preGetView, this.preGetView);
    this.listenToMany(viewActions);

    //this.joinTrailing(
    //  apiActions.getCatalog.completed,
    //  apiActions.getViews.completed,
    //  this.getCatalogAndViewsCompleted
    //);
    init = true;
  },

  // getCurrentView() {
  //   let currViewId = this.getIn(['currentCatalog', 'currentViewId']);
  //   let view = this.getIn(['currentCatalog', 'views']).filter(v => v.get('id') !== currViewId);
  //   // todo: or if new ?
  //   return view;
  // },

  preGetView({ viewId, catalogId }) {
    // if select virtual view, need hand manipulate.

    // clear filterChanged on each view except this
    const views = this.getIn(['catalogs', catalogId, 'views']);
    views && views.map(v => {
      const id = v.get('id');
      if (id !== viewId && v.get('filterChanged')) {
        this.setIn(['catalogs', catalogId, 'views', id, 'filterChanged'], false);
      }
      return v;
    });

    if (Number(viewId) === 0 || viewId === "$new") {

    } else if (!this.getIn(['catalogs', catalogId, 'views', viewId, 'filterChanged'])) {
      // pass apiActions
      apiActions.getView({ viewId, catalogId })
    }
  },

  selectView(viewId, catalogId) {
    log('select view %s in catalog ', viewId, catalogId);

    // drop newView if exist.
    let newView = this.getIn(['currentCatalog', 'views']).find(v => v.get('isNew'));
    if (newView) {
      this.setIn(
        ['currentCatalog', 'views'],
        this.getIn(['currentCatalog', 'views']).filter(v => !v.get('isNew'))
      );

      // need update filters
      viewActions.preGetView({ viewId, catalogId });
    }

    // fast change views.
    this.setIn(['route, params', 'viewId'], viewId);

    switch (this.getIn(['routeParams', 'tabId'])) {
      case 'records':
        setTimeout(function () {
          recordActions.requestForRecords(catalogId, Number(viewId) === 0 ? {} : { viewId });
        });
        break;
      case 'history':
        historyActions.clearHistory(catalogId);
        historyActions.loadHistory(catalogId, null, Number(viewId) === 0 ? {} : { viewId });
        break;
      case 'reports':
        break;
      default:
        break;
    }

    // router.go(null, { viewId, catalogId });

    this.changed();
  },

  createViewCompleted(res, params, data) {
    // Update new ViewItem.
    let newView = this.getIn(['currentCatalog', 'views']).find(v => v.get('isNew'));
    if (newView) {
      newView = newView.set('id', res.id)
        .set('name', data.name)
        .set('originName', data.originName)
        .set('fieldPrivilegeCodes', data.fieldPrivilegeCodes)
        .set('forRights', data.forRights)
        .set('isNew', false);
      let views = this.getIn(['currentCatalog', 'views']).filter(v => !v.get('isNew'));
      views = views.push(newView);
      this.setIn(['currentCatalog', 'views'], views);
      this.setIn(['currentCatalog', 'currentViewId'], res.id);

      this.changed();

      // open modalAccess if it's rightsView.
      if (data.forRights) {
        modalsActions.openViewAccessModal(res.id, false, (result) => {
          if (result.viewId) {
            router.go('main.section.catalogData', { viewId: result.viewId });
          } else {
            router.go('main.section.catalogData');
          }
        });
      }
    }
  },

  // find view by id and update name and rights.
  updateViewCompleted(res, params, data) {
    this.setIn(
      ['catalogs', data.id, 'views'],
      this.getIn(['currentCatalog', 'views']).map(view => {
        if (view.get('id') === params.viewId) {
          view = view
            .set('name', data.name)
            .set('originName', data.originName)
            .set('fieldPrivilegeCodes', data.fieldPrivilegeCodes)
            .set('forRights', data.forRights);
        }
        return view;
      })
    );
    this.changed();

    // if changed forRights:  private -> rights
    if (!params.forRights && data.forRights) {
      modalsActions.openViewAccessModal(params.viewId, false, (result) => {
        router.go('main.section.catalogData');
      });
    }
  },

  /**
   * Create "virtual" view and set on top.
   */
  getViewsCompleted(data, { catalogId }) {
    //  if (!this.get('currentCatalog')) {
    //    let catalog = CatalogFactory.create({ id: catalogId });
    //   this.set('currentCatalog', catalog);
    // }
    // if (this.getIn(['currentCatalog', 'id']) !== catalogId) {
    //   return;
    // }

    let views = Immutable.Map();
    // create default view (all items)
    let catalogDataName = this.get('catalogs').get(catalogId).get('name');
    let catalogName = antiCapitalize(String(catalogDataName).trim());
    views = views.set('0', ViewFactory.create({
      id: 0,
      name: trs('views.list.all') + ' ' + catalogName,
      isNew: false,
      index: -Infinity,
      catalogId
    }));

    // create map of views
    data.forEach((v, i) => {
      v.catalogId = catalogId;
      const id = v.id.toString();
      v.index = i;
      v = ViewFactory.create(v);
      views = views.set(id, v);
    });

    this.mergeDeepIn(['catalogs', catalogId, 'views'], views);
    this.changed();
  },

  getCatalogCompleted(catalogData, { catalogId }) {
    // if (this.getIn(['currentCatalog', 'id']) !== catalogId) {
    //   return;
    // }

    // need update name in virtual view.
    let catalogName = antiCapitalize(String(catalogData.name).trim());
    if (this.getIn(['catalogs', catalogId, 'views'])) {
      this.setIn(
        ['catalogs', catalogId, 'views'],
        this.getIn(['catalogs', catalogId, 'views']).map(v => {
          if (v.get('id') === 0)
            v = v.set('name', trs('views.list.all') + ' ' + catalogName);
          return v;
        })
      );
      this.changed();
    }

    // if (this.getIn(['catalogs', catalogId, 'currentView'])) {
    //   let view = this.getIn(['currentCatalog', 'currentView']);
    //   if (view.get('id') === 0) {
    //     this.setIn(['currentCatalog', 'currentView'], view.set('name', trs('views.list.all') + ' ' + catalogName));
    //     this.changed();
    //   }
    // }
  },

  getView({ catalogId, viewId }) {

  },

  getViewCompleted(data, { catalogId, viewId }) {

    // create catalog if not exists
    if (!this.getIn(['catalogs', catalogId])) {
      let catalog = CatalogFactory.create({ id: catalogId });
      this.setIn(['catalogs', catalogId], catalog);
    }
    // create view if not exists
    if (!this.getIn(['catalogs', catalogId, 'views'])) {
      this.setIn(['catalogs', catalogId, 'views'], Immutable.Map());
    }

    // convert filters array to map
    var hashmap = _.reduce(data.filters, function (hash, value) {
      var key = value['attr'];
      hash[key] = value;
      return hash;
    }, {});
    data.filters = hashmap;

    // set view
    data.catalogId = catalogId;
    const view = ViewFactory.create(data);
    let views = Immutable.Map();
    views = views.set(viewId, view);

    this.mergeDeepIn(['catalogs', catalogId, 'views'], views);
    this.changed();
  },

  /**
   * Listener on update filter of view.
   * create new view if not exist.
   */
  updateFieldFilter({ catalogId, viewId }) {
    if (Number(viewId) === 0) {

      let newView = this.getIn(['catalogs', catalogId, 'views', '$new']);

      // create new view
      if (!newView) {
        newView = ViewFactory.create({
          id: '$new',
          index: Infinity,
          name: trs('views.newView'),
          catalogId: catalogId,
          filterChanged: true,
        });
        this.setIn(['catalogs', catalogId, 'views', '$new'], newView);
      }

      // redirect to view $new
      // ... todo

    } else {
      // set filter changed to view
      this.setIn(['catalogs', catalogId, 'views', viewId, 'filterChanged'], true);
    }

    this.changed();
  },

  deleteViewCompleted(res, { catalogId, viewId }) {
    if (router.includes('main.section.catalogData', { catalogId }) ||
      router.includes('main.section.catalogData', { catalogId, viewId })) {

      router.go('main.section.catalogData', { catalogId, viewId: '0' });
    }
    // remove deleted view from state.
    let newViews = this.getIn(['currentCatalog', 'views']).filter(v => v.get('id') !== viewId);
    this.setIn(['currentCatalog', 'views'], newViews);
    this.changed();

    this.selectView('0', catalogId);
  },
  deleteCatalogFailed(err, { catalogId }) {
  },
  /**
   * request on create new iew filters.
   */
  createNewView(catalogId, data) {
    let filters = this.getCatalogFilters(catalogId);
    if (filters) {
      filters = filters.toJS();
      data.filters = _.map(filters, (value, attr) => {
        return { attr: Number(attr), value }
      });
      // hack for double request.
      createView(catalogId, data);
    }
  },
  /**
   * request on create new iew filters.
   */
  saveView(catalogId, viewId, data) {
    saveDebouncedView(catalogId, viewId, data);
  },

  /**
   * request on create new iew filters.
   */
  setField(fieldId, value) {
    if (value !== 'inherit') {
      appState.setIn(['currentCatalog', 'currentView', 'fieldPrivilegeCodes', fieldId], value);
    } else {
      appState.deleteIn(['currentCatalog', 'currentView', 'fieldPrivilegeCodes', fieldId]);
    }
  },

  setViewProperty(name, value) {
    appState.setIn(['currentCatalog', 'currentView', name], value);
  }
};
