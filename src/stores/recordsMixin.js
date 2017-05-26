import Immutable from 'immutable'
import guid from 'guid'
import _ from 'lodash'
import CatalogFactory from '../models/CatalogFactory'
import RecordFactory from '../models/RecordFactory'
import apiActions from '../actions/apiActions'
import recordActions from '../actions/recordActions'
import appState from '../appState'
import FIELD_TYPES from '../configs/fieldTypes'
import VALIDATION_ERRORS from '../configs/validationErrors'
import { validateField } from '../components/record/recordFieldValidator'
import trs from '../getTranslations'
import { alert } from '../components/common/Modal'

const recordsMixin = {
  getRelationsCompleted(records, params) {
    let record = this.getIn(['records', params.catalogId, params.recordId]);

    if (record) {
      record = record.set('linkedData', Immutable.fromJS(records || []));
      record = record.set('_linkedDataLoadTime', Date.now());
      this.setIn(['records', params.catalogId, params.recordId], record);

      this.changed();
    }
  },

  updateRecordValue(catalogId, recordId, fieldId, value) {
    if (!fieldId) {
      return;
    }
    this.mergeIn(['records', catalogId, recordId, 'values'], {
      [fieldId]: value
    });
    this.changed();
  },

  updateRecord(params) {
    this.setIn(['records', params.catalogId, params.recordId, 'saving'], true);
    this.setIn(['records', params.catalogId, params.recordId, 'saveError'], null);
    this.changed();
  },

  updateRecordCompleted(result, { catalogId, recordId }, data) {
    let record = this.getIn(['records', catalogId, recordId]);

    if (record && record.get('id') === recordId) {
      let values = record.get('values');
      _.forEach(data.values, (val, key) => {
        values = values.set(key, Immutable.fromJS(val));
      });
      record = record.set('values', values);
      record = record.set('originValues', values);
      this.setIn(['records', catalogId, recordId], record);
      this.setIn(['records', catalogId, recordId, 'isNew'], null);
      this.setIn(['records', catalogId, recordId, 'saving'], false);
      this.setIn(['records', catalogId, recordId, 'history', 'forceReload'], true);
      this.setIn(['records', catalogId, recordId, 'saveError'], null);

      if (this.getIn(['catalogs'])) {
        if (this.getIn(['catalogs', catalogId])) {
          let idx = this.getIn(['catalogs', catalogId, 'records']).findIndex(r => r.get('id') === recordId);
          if (idx !== -1) {
            this.setIn(['catalogs', catalogId, 'records', idx, 'values'], record.get('values'));
          }
        }
        let linkFields = this.getIn(['catalogs', catalogId, 'fields'])
          .filter(f => f.get('type') === FIELD_TYPES.OBJECT || f.get('type') === FIELD_TYPES.USER);

        let needReload;

        if (linkFields.size > 0) {
          this.getIn(['catalogs', catalogId, 'records']).forEach(r => {
            if (needReload) {
              return;
            }
            linkFields.forEach(f => {
              if (needReload) {
                return;
              }
              r.getIn(['values', f.get('id')]).forEach(v => {
                if (needReload) {
                  return;
                }
                if (f.get('type') === FIELD_TYPES.OBJECT) {
                  if (v.get('catalogId') === catalogId && v.get('recordId') === recordId) {
                    needReload = true;
                  }
                } else {
                  if (v.get('id') === recordId) {
                    needReload = true;
                  }
                }
              });
            });
          });

          if (needReload) {
            recordActions.requestForRecords(this.get(catalogId));
          }
        }
      }

      this.changed();
    }
  },

  updateRecordFailed(err, params) {
    const errText = (_.isObject(err) && err.text) ? err.text : '';
    this.setIn(['records', params.catalogId, params.recordId, 'saving'], false);
    this.setIn(['records', params.catalogId, params.recordId, 'saveError'], errText || true);
    this.changed();
    const isAccessDenied = (err.status == 403);
    if (isAccessDenied) {
      alert({
        headerText: trs('modals.denied.record.update.headerText'),
        text: errText || trs('modals.denied.record.update.text'),
        okText: trs('modals.denied.okText')
      });
    } else {
      alert({
        headerText: err.title || trs('modals.recordSaveError.headerText'),
        text: errText || trs('modals.recordSaveError.text'),
        okText: trs('modals.recordSaveError.okText')
      });
    }
  },

  setFieldVisibility(params) {
    let catalog = this.getIn(['catalogs', params.catalogId]);
    if (!catalog) {
      return;
    }
    let colIndex = catalog.get('fields').findIndex((c) => c.get('id') === params.fieldId);
    if (colIndex === -1) {
      return;
    }
    catalog = catalog.setIn(['fields', colIndex, 'visible'], params.visible);
    this.setIn(['catalogs', params.catalogId], catalog);
    this.changed();
  },

  setFieldVisibilityFailed() {
    // TODO: revert visibility if possible, or download fields
  },

  // apply visible setting for to
  getFieldsVisibilityCompleted(data, params) {
    let fields = this.getIn(['catalogs', params.catalogId]).get('fields');
    fields = fields.map(field => {
      // get field
      let $field = _.find(data, $field => $field.fieldId == field.get('id'));
      if ($field)
        field = field.set('visible', $field.value);
      return field;
    });

    this.setIn(['catalogs', params.catalogId, 'fields'], fields);
    this.changed();
  },

  openLinkedRecordModal(catalogId, recordId) {
    this.setIn(['linkedRecords', recordId], true);
    this.changed();
  },

  generateNewRecord(catalogId, newRecordId, linkedRecord) {
    let record = RecordFactory.create({ id: newRecordId, isNew: true });

    record = record.set('originValues', record.get('values'));

    if (linkedRecord) {
      record = record.set('linkedRecord', Immutable.fromJS(linkedRecord));
    }

    this.setIn(['records', catalogId, newRecordId], record);
    this.changed();
  },

  getCatalogCompleted(data, params) {
    let catalogRecords = this.getIn(['records', params.catalogId]);
    if (catalogRecords) {
      catalogRecords = catalogRecords.map((record) => {
        // if ( !record.get('fields') ) {
        record = record.set('fields', Immutable.fromJS(data.fields));
        if (record.get('isNew') && !record.get('isDefaultReceived')) {
          let values = RecordFactory.getEmptyValues(data.fields);
          record = record.set('isDefaultReceived', true);
          if (record.get('linkedRecord')) {
            const linkedCatalogId = record.getIn(['linkedRecord', 'catalogId']);
            const linkedCatalogRecord = record.getIn(['linkedRecord', 'record']);
            const linkedRecord = {
              catalogId: linkedCatalogId,
              catalogTitle: data.title,
              catalogIcon: data.icon,
              recordId: linkedCatalogRecord.get('id'),
              recordTitle: linkedCatalogRecord.get('title')
            };
            _.forEach(data.fields, (field) => {
              if ((field.type == FIELD_TYPES.OBJECT) && (field.config.catalogs)) {
                _.forEach(field.config.catalogs, (catalog) => {
                  if (catalog.id == linkedCatalogId) {
                    values[field.id] = [linkedRecord];
                  }
                });
              }
            });
          }
          record = record.set('values', Immutable.fromJS(values));
        }
        // }
        return record;
      });
      this.setIn(['records', params.catalogId], catalogRecords);
    }

    this.changed();
  },


  getRecord(params) {
    let recordKey = ['records', params.catalogId, params.recordId];

    if (!this.getIn(recordKey)) {
      this.setIn(recordKey, RecordFactory.create());
      this.setIn([...recordKey, 'loading'], true);
      this.setIn([...recordKey, 'loadError'], null);

      this.changed();
    }
  },

  getRecordCompleted(data, params) {
    let record = this.getIn(['records', params.catalogId, params.recordId]);

    if (record) {
      if (Immutable.is(record)) {
        record = record.toJS();
      }
      record = Immutable.fromJS(record).merge(data);
    } else {
      record = RecordFactory.create(data);
    }

    record = record.setIn(['history', 'count'], data.historyCount);
    record = record.set('_loadTime', Date.now());
    record = record.set('originValues', record.get('values'));

    this.setIn(['records', params.catalogId, params.recordId], record);
    this.setIn(['records', params.catalogId, params.recordId, 'loading'], false);
    this.setIn(['records', params.catalogId, params.recordId, 'loadError'], null);

    this.changed();
  },

  onGetRecordFailed(err, params) {
    const errText = (_.isObject(err) && err.text) ? err.text : '';
    this.setIn(['records', params.catalogId, params.recordId, 'loading'], false);
    this.setIn(['records', params.catalogId, params.recordId, 'loadError'], errText || true);
    const isAccessDenied = (err.status == 403);
    if (isAccessDenied) {
      alert({
        headerText: trs('modals.denied.record.read.headerText'),
        text: errText || trs('modals.denied.record.read.text'),
        okText: trs('modals.denied.okText')
      });
    } else {
      alert({
        headerText: err.title || trs('modals.loadRecordError.headerText'),
        text: errText || trs('modals.loadRecordError.text'),
        okText: trs('modals.loadRecordError.okText')
      });
    }
    this.changed();
  },


  getRecords(params, query) {
    let catalog = this.getIn(['catalogs', params.catalogId]);

    // catalog not set after location.reload()
    if (catalog) {

      if (query.offset === 0) {
        catalog = catalog.set('records', Immutable.fromJS([]));
      }

      catalog = catalog.merge(Immutable.fromJS({
        loading: true,
        loadingError: null,
        query,
        //allRecordsLoaded: query.offset === 0 ? false : catalog.get('allRecordsLoaded')
      }));

      this.setIn(['catalogs', params.catalogId], catalog);
      this.changed();
    }
  },

  getRecordsFailed(err, params) {
    const errText = (_.isObject(err) && err.text) ? err.text : '';
    const isAccessDenied = err.status && (err.status == 403);
    if (isAccessDenied) {
      alert({
        headerText: err.title || trs('modals.denied.record.read.headerText'),
        text: errText || trs('modals.denied.record.read.text'),
        okText: trs('modals.denied.okText')
      });
    }

    let catalog = this.getIn(['catalogs', params.catalogId]);

    if (!catalog) {
      return;
    }

    this.setIn(['catalogs', params.catalogId, 'loading'], false);
    this.setIn(['catalogs', params.catalogId, 'loadingError'], Immutable.fromJS(errText));
    this.changed();
  },

  getRecordsCompleted(records, params, data, query, response) {
    let catalog = this.getIn(['catalogs', params.catalogId]);
    let currentQuery = catalog.get('query');

    // todo remove this workaround
    // если currentQuery не задан, скорее всего это состояние обновления страницы
    // т.е. когда страницу обновляют, то catalog еще не сушествует и
    // поэтому в него никто не запишет query
    if (catalog && currentQuery && !Immutable.is(Immutable.fromJS(query), currentQuery)) {
      return;
    }

    if (!catalog) {
      catalog = CatalogFactory.create({
        id: params.catalogId
      });
    } else {
      catalog = catalog.slice();
      if (query.offset === 0) {
        catalog = catalog.set('records', Immutable.fromJS([]));
      }
    }

    // catalog = CatalogFactory.setCatalogFields(catalog, records.fields);
    catalog = CatalogFactory.setRecords(catalog, records, query.offset > 0);
    catalog = catalog.merge({
      _fieldsCreateTime: Date.now(),
      allRecordsLoaded: records.length < query.limit,
      recordsCount: response.headers['x-total-count'],
      loading: false,
      loadingError: null,
      // name: records.name,
      // count: records.count,
      // icon: records.icon
    });


    this.setIn(['catalogs', params.catalogId], catalog);
    this.changed();
  },

  createRecordFailed(err, params) {
    const errText = (_.isObject(err) && err.text) ? err.text : '';
    this.setIn(['records', params.catalogId, appState.getIn(['newRecordId', params.catalogId]), 'creating'], false);
    this.setIn(['records', params.catalogId, appState.getIn(['newRecordId', params.catalogId]), 'createError'], errText || true);
    const isAccessDenied = err.status && (err.status == 403);
    if (isAccessDenied) {
      alert({
        headerText: trs('modals.denied.record.create.headerText'),
        text: errText || trs('modals.denied.record.create.text'),
        okText: trs('modals.denied.okText')
      });
    } else {
      alert({
        headerText: err.title || trs('modals.createRecordError.headerText'),
        text: errText || trs('modals.createRecordError.text'),
        okText: trs('modals.createRecordError.okText')
      });
    }
    this.changed();
  },

  /**
   * Delete Record
   */
  deleteRecord(params) {
    this.setIn(['records', params.catalogId, params.recordId, 'deleting'], true);
    this.setIn(['records', params.catalogId, params.recordId, 'deleteError'], false);
    this.changed();
  },
  deleteRecordCompleted(result, params) {
    this.deleteIn(['records', params.catalogId, params.recordId]);
    // if (router.includes('main.section.catalogData.record', {
    //   catalogId: params.catalogId,
    //   recordId: params.recordId
    // })) {
    //   router.go('main.section.catalogData', {
    //     catalogId: params.catalogId
    //   });

    // TODO: update only when there are no filters applied
    recordActions.requestForRecords(params.catalogId);
    // }
    this.changed();
  },
  deleteRecordFailed(err, params) {
    const errText = (_.isObject(err) && err.text) ? err.text : '';
    this.setIn(['records', params.catalogId, params.recordId, 'deleting'], false);
    this.setIn(['records', params.catalogId, params.recordId, 'deleteError'], errText || true);
    this.changed();
    const isAccessDenied = err.status && (err.status == 403);
    if (isAccessDenied) {
      alert({
        headerText: trs('modals.denied.record.delete.headerText'),
        text: errText || trs('modals.denied.record.delete.text'),
        okText: trs('modals.denied.okText')
      });
    } else {
      alert({
        headerText: err.title || trs('modals.deleteRecordError.headerText'),
        text: errText || trs('modals.deleteRecordError.text'),
        okText: trs('modals.deleteRecordError.okText')
      });
    }
  },

  validateAndSaveRecord(catalogId, recordId, values, success, fail) {
    let record = this.getIn(['records', catalogId, recordId]);
    let fields = record.get('fields');
    let isNew = record.get('isNew') || false;
    let errors = [];
    let hasErrors = false;
    let allValues = appState.getIn(['records', catalogId, recordId, 'values']).toJS();
    _.forEach(values, (value, key) => {
      if (_.has(value, 'toJS')) {
        value = value.toJS();
      }
      allValues[key] = value;
    });
    fields.map((field, key) => {
      let value = allValues[field.get('id')];
      let type = field.get('type');
      let empty = !validateField(type, value);
      if (field.get('required') && empty) {
        errors.push({ fieldId: field.get('id'), error: VALIDATION_ERRORS.REQUIRED_FIELD_EMPTY });
        hasErrors = true;
      }
      switch (field.get('type')) {
        case FIELD_TYPES.NUMBER:
          if (value && (!_.inRange(parseFloat(value), Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER))) {
            errors.push({ fieldId: field.get('id'), error: VALIDATION_ERRORS.REQUIRED_FIELD_EMPTY });
            hasErrors = true;
          }
          break;
        default:
          break;
      }
      return null;
    });

    //Если ошибки нет, то создаем или сохраняем запись
    if (!hasErrors) {
      if (isNew) {
        apiActions.createRecord({
          catalogId: catalogId,
        }, { values }).then(success, fail);
      } else {
        return apiActions.updateRecord({
          catalogId: catalogId,
          recordId: recordId
        }, {
            values: values
          }).then(success, fail);
      }
    }
    else {
      //Ошибка есть - возвращем не сохраняя
      this.setIn(['records', catalogId, recordId, 'saving'], false);
      this.setIn(['records', catalogId, recordId, 'creating'], false);
      this.changed();
    }
    recordActions.updateErrorFields(catalogId, recordId, errors);
  },

  uploadFileRecordCompleted(...data) {
  },

  cloneRecord({ catalogId, recordId }) {
    const fields = this.getIn(['catalogs', catalogId, 'fields']);
    const newRecordId = guid.raw();
    let values = this.getIn(['records', catalogId, recordId, 'values']);
    this.setIn(['records', catalogId, newRecordId], RecordFactory.create({
      id: newRecordId,
      isNew: true,
      values: {},
      fields
    }));
    // remove files and id from contacts
    fields.forEach(field => {
      switch (field.get('type')) {
        case FIELD_TYPES.FILE:
          values = values.removeIn([field.get('id')]);
          break;
        case FIELD_TYPES.CONTACT:
          const mapIn = (path, mapFn) => {
            const val = values.getIn(path);
            return values.setIn(path, val && val.map(mapFn));
          };
          values = mapIn([field.get('id')], val => {
            return val.remove('id');
          });
          break;
        default:
          break;
      }
    });
    // because on save sent only changed values
    this.setIn(['records', catalogId, newRecordId], this.getIn(['records', catalogId, newRecordId]).merge({
      values,
      isDefaultReceived: true,
    }));
    this.setIn(['newRecordId', catalogId], newRecordId);
    // router.go('main.section.catalogData.addRecord', { catalogId });
  },

  shouldUpdateProcess(catalogId, recordId, fieldId) {
    this.mergeIn(['records', catalogId, recordId, 'updateProcesses', 'fields', fieldId], { shouldProcess: true });
    this.mergeIn(['records', catalogId, recordId, 'updateProcesses'], { should: true });

    this.changed();
  }
};

export default recordsMixin;
