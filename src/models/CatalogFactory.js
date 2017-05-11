import Immutable from 'immutable';
import Guid from 'guid';
import FieldFactory from './FieldFactory';
import RecordFactory from './RecordFactory';
import FIELD_TYPES from '../configs/fieldTypes';

export default {
  create(data) {
    data = data || {};
    let catalog = {
      __name: 'Catalog'
    };

    // server data
    catalog.id = data.id != null && data.id.toString() || null;
    catalog.name = data.name || '';
    catalog.icon = data.icon || '';
    catalog.count = data.count || 0;
    // catalog.notifications = data.notifications || 0;
    catalog.sectionId = data.sectionId;
    catalog.privilegeCode = data.privilegeCode;

    catalog.fields = null;
    catalog.records = [];
    catalog.rights = data.rights;
    catalog.isNew = data.isNew;

    catalog.allRecordsLoaded = false; // are all records loaded for current params
    catalog.lastLoadParams = null; // last load request params
    catalog.loading = false; // is there pending request for catalog records
    catalog.loadingError = null; // err obj for last request for records

    catalog.history = {};
    
    catalog.widgetsChartData = {};
    catalog.boards = {
      loaded: false, loading: false, list: []
    };

    catalog = Immutable.fromJS(catalog);

    if ( data.fields && data.fields.length ) {
      catalog = this.setCatalogFields(catalog, data.fields);
    } else if ( catalog.get('isNew') ) {
      catalog = catalog.setIn(['fields'], Immutable.List([FieldFactory.create({
        type: FIELD_TYPES.GROUP
      })]));
    }

    return catalog;
  },

  setCatalogFields(catalog, fields) {
    let orderMatch = true;
    let currColIds = [];
    let currCols = catalog.get('fields') || Immutable.List();
    currCols.forEach((c)=> currColIds.push(c.get('id')));
    fields = fields.map((field, i)=> {
      field.id = field.id.toString();
      field.visible = true;
      if ( field.id !== currColIds[i] ) {
        orderMatch = false;
      }
      return FieldFactory.create(field);
    });

    if ( orderMatch && fields.length === currCols.size ) {
      return catalog.set('fields', currCols.mergeDeep(fields));
    } else {
      return catalog.set('fields', Immutable.List(fields));
    }
  },

  setRecords(catalog, records, appendRecords = false) {
    records = records.map((c)=> RecordFactory.create(c));
    records = Immutable.List(records);
    if ( appendRecords ) {
      records = catalog.get('records').concat(records);
    }
    return catalog.set('records', records);
  }
};
