import debug from 'debug';
import Immutable from 'immutable';
import router from '../router';
import CatalogFactory from '../models/CatalogFactory';
import RecordFactory from '../models/RecordFactory';
import recordActions from '../actions/recordActions';
import guid from 'guid';

const log = debug('CRM:Store:routeMixin');

const routeMixin = {

  onRouteChange(route, params) {
    log('onRouteChange', route, params);

    let prevRoute = this.get('prevRoute');
    let prevRouteParams = this.get('prevRouteParams');

    this.set('prevRoute', this.get('route'));
    this.set('prevRouteParams', this.get('routeParams'));

    this.set('route', Immutable.fromJS(route));
    this.set('routeParams', Immutable.fromJS(params));

    // if ( this.get('createCatalogAllowed') == null || route === 'main.section.addCatalog' ) {
    //   apiActions.checkCreateCatalogPrivilege();
    // }

    let recordId = params.recordId;
    if (router.includes('main.section.catalogData') &&
      ( recordId !== prevRouteParams.recordId || params.catalogId !== prevRouteParams.catalogId )) {

      let time = Date.now() - 10 * 60 * 1000;

      let catalog = this.get('currentCatalog');
      let catlogRecord = catalog && catalog.get('records').find((r)=> r.get('id') === recordId);
      if (catlogRecord && catlogRecord.get('_createTime') > time && catalog.get('_fieldsCreateTime') > time) {
        catlogRecord = catlogRecord.set('fields', catalog.get('fields'));
        catlogRecord = catlogRecord.set('_loadTime', catalog.get('_fieldsCreateTime'));
      } else {
        catlogRecord = null;
      }

      let record = this.getIn(['records', params.catalogId, recordId]);
      let recordToSet;

      if (catlogRecord && ( !record || record.get('_loadTime') < time || record.get('_loadTime') < catalog.get('_loadTime') )) {
        recordToSet = catlogRecord;
      } else if (record && record.get('_loadTime') < time) {
        recordToSet = undefined;
      } else if (!this.getIn(['records', params.catalogId, recordId])) {
        // recordToSet = RecordFactory.create({id: recordId});
      }

      if (recordToSet !== undefined) {
        this.setIn(['records', params.catalogId, recordId], recordToSet);
      }
    }

    if (router.includes('main.section.catalogData.catalogRights') && !recordId) {
       this.$routeCatalogRights(params);
    }
    if (router.includes('main.section.catalogData.addRecord') && !recordId) {
       this.$routeCreateNewRecord(params);
    }
    if (router.includes('main.section.catalogData.addRecord')) {
      recordActions.clearErrors(params);
    }

    if (router.includes('main.section.catalogData') && !this.getIn(['records', params.catalogId]))
      this.setIn(['records', params.catalogId], new Immutable.Map());
    if (router.includes('main.section.catalogData') && !this.getIn(['records', params.catalogId]))
      this.setIn(['records', params.catalogId], new Immutable.Map());

    if (router.includes('main.section.catalogData') && this.get('currentIdCatalog') !== params.catalogId) {
      this.set('currentIdCatalog', params.catalogId);
      let catalog = this.getIn(['catalogs', params.catalogId]);
      if (catalog) {
        this.set('currentCatalog', CatalogFactory.create(catalog.toJS()));
      } else {
        this.set('currentCatalog', null);
      }
    }

    if (!router.includes('main.section')) {
      this.set('currentIdCatalog', null);
      this.set('currentCatalog', null);
    }


    if (router.includes('main.section.editCatalog') &&
      this.getIn(['editingCatalogs', params.sectionId, 'id']) !== params.catalogId) {
      let st = this.getState();
      st.deleteIn(['editingCatalogs', params.sectionId]);
      this.setState(st);
    }

    // clear all editing catalogs with createError or not changed
    if (!router.includes('main.section.editCatalog') && !router.includes('main.section.addCatalog')) {
      this.set('editingCatalogs', new Immutable.Map());
    }


    // Set new empty catalog as editingCatalog, if there is no editingCatalog or editingCatalog isn't new
    if (router.includes('main.section.addCatalog') &&
      ( !this.getIn(['editingCatalogs', params.sectionId]) || !this.getIn(['editingCatalogs', params.sectionId, 'isNew']) )) {
      let catalog = CatalogFactory.create({
        isNew: true,
        icon: 'content-11'
      });
      this.setIn(['editingCatalogs', params.sectionId], catalog);
    }

    this.changed();
  },

  $routeCreateNewRecord({catalogId}) {
    let newRecordId = this.getIn(['newRecordId', catalogId]);
    if (!newRecordId) {
      newRecordId = guid.raw();

      this.setIn(['records', catalogId, newRecordId], RecordFactory.create({
        id: newRecordId,
        isNew: true
      }));

      this.setIn(['newRecordId', catalogId], newRecordId);
    }
  },

  $routeCatalogRights({catalogId}) {
  }
};

export default routeMixin;
