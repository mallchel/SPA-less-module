import debug from 'debug';
import _ from 'lodash';
import guid from 'guid';
import router from '../router';
import CatalogFactory from '../models/CatalogFactory';
import FieldFactory from '../models/FieldFactory';
import RecordFactory from '../models/RecordFactory';
import apiActions from '../actions/apiActions';
import Immutable from 'immutable';

const log = debug('CRM:catalogsMixin');

export default {

  getCatalogs() {
    this.set('catalogsLoading', true);
    this.set('catalogsLoadError', null);
    this.changed();
  },
  getCatalogsCompleted(res, params, query) {
    // Handle request with empty query
    if (_.size(query) === 0) {
      let byId = {};
      res.forEach((c, i) => {
        c.id = c.id.toString();
        c.index = i;
        byId[c.id] = c;
      });
      let catalogs = this.get('catalogs').filter(c => {
        let id = c.get('id').toString();
        return _.keys(byId).indexOf(id) >= 0
      });
      log(catalogs && catalogs.toJS());
      this.set('catalogs', catalogs.mergeDeep(byId));
      this.set('catalogsLoading', false);
      this.set('catalogsLoadError', null);

      this.changed();
    }
    // catalogs = catalogs.map((cat)=> CatalogFactory.create(cat));
    // catalogs = _.sortBy(catalogs, (t)=> t.get('order'));
    // this.set('catalogs', Immutable.fromJS(catalogs));
  },
  getCatalogsFailed(e) {
    this.set('catalogsLoading', false);
    this.set('catalogsLoadError', e);
    this.changed();
  },

  checkCreateCatalogPrivilegeCompleted(granted) {
    this.set('createCatalogAllowed', granted || false);
    this.changed();
  },

  getCatalogFieldsCompleted({ catalogId }, data) {
    let catalog = this.getIn(['catalogs', catalogId]);
    if (!catalog) {
      return;
    }

    catalog = CatalogFactory.setCatalogFields(catalog, data.fields);
    this.setIn(['catalogs', catalogId], catalog);
    this.changed();
  },

  /* ============================
   * Get Catalog
   */

  getCatalogCompleted(data, { catalogId }, params, query, res, actionParams) {
    const sectionId = data.sectionId.toString();

    if (actionParams === 'catalogEdit' && this.getIn(['editingCatalogs', sectionId]) == null) {
      let catalog = CatalogFactory.create(data);
      catalog = catalog.set('originalFields', catalog.get('fields'));
      this.setIn(['editingCatalogs', sectionId], catalog);
      this.changed();
    }

    if (actionParams !== 'catalogEdit') {
      if (!this.getIn(['catalogs', catalogId])) {
        const catalog = CatalogFactory.create(data);
        this.setIn(['catalogs', catalogId], catalog);

      } else {
        const fields = new Immutable.List(data.fields.map(f => FieldFactory.create(f)));
        this.mergeIn(['catalogs', catalogId], data);
        this.setIn(['catalogs', catalogId, 'fields'], fields);
      }
      this.changed();
    }
  },

  /* ============================
   * Create Catalog
   */
  createCatalog({ sectionId }) {
    this.setIn(['editingCatalogs', sectionId, 'creating'], true);
    this.setIn(['editingCatalogs', sectionId, 'createError'], null);
    this.setIn(['editingCatalogs', sectionId, 'sectionId'], sectionId);
    this.changed();
  },

  createCatalogCompleted({ id: catalogId }, { sectionId }) {
    if (router.includes('main.section.addCatalog') && this.getIn(['routeParams', 'sectionId']) === sectionId) {
      router.go('main.section.catalogData', {
        sectionId: sectionId,
        catalogId: catalogId
      });
      apiActions.getCatalogs();
    }
  },

  createCatalogFailed(err, { sectionId }) {
    this.setIn(['editingCatalogs', sectionId, 'creating'], false);
    this.setIn(['editingCatalogs', sectionId, 'createError'], err || true);
    this.changed();
  },

  /* ================================
   * Update Catalog
   */
  updateCatalog({ sectionId }) {
    this.setIn(['editingCatalogs', sectionId, 'updating'], true);
    this.setIn(['editingCatalogs', sectionId, 'updateError'], null);
    this.changed();
  },

  updateCatalogCompleted(res, { catalogId, sectionId }) {
    if (router.includes('main.section.editCatalog') &&
      this.getIn(['routeParams', 'sectionId']) === sectionId &&
      this.getIn(['routeParams', 'catalogId']) === catalogId) {
      let newRecordId = guid.raw();
      this.setIn(['records', catalogId, newRecordId], RecordFactory.create({
        id: newRecordId,
        isNew: true
      }));
      this.setIn(['newRecordId', catalogId], newRecordId);
      router.go('main.section.catalogData', {
        sectionId: sectionId,
        catalogId: catalogId
      });
      apiActions.getCatalogs();
    }
  },

  updateCatalogFailed(err, { sectionId }) {
    this.setIn(['editingCatalogs', sectionId, 'updating'], false);
    this.setIn(['editingCatalogs', sectionId, 'updateError'], err || true);
    this.changed();
  },

  /**
   * Delete Catalog
   */
  deleteCatalog({ catalogId }) { },

  deleteCatalogCompleted(res, { catalogId }) {
    if (router.includes('main.section.editCatalog', { catalogId }) ||
      router.includes('main.section.catalogData', { catalogId })) {
      router.go('main.section');
    }

    apiActions.getCatalogs();
  },

  deleteCatalogFailed(err, { catalogId }) {
  },

  changeSortIndex(order) {
    order.forEach((id, index) => {
      this.setIn(['catalogs', id, 'index'], index);
    })
    this.changed();
  },

  /**
   * add catalog
   */
  addCatalog({ sectionId }) {
    const catalog = CatalogFactory.create({
      isNew: true,
      icon: 'content-11'
    });
    this.setIn(['editingCatalogs', sectionId], catalog);
    this.changed();
  },

};
