import _ from 'lodash';
import Reflux from 'reflux';
import debug from 'debug';
import Immutable from 'immutable';

import FieldFactory from '../models/FieldFactory';

import UPLOADING_FILES_STATUSES from '../configs/uploadingFileStatuses';
import apiActions from '../actions/apiActions';

const log = debug('CRM:Store:importStore');

const importStore = Reflux.createStore({
  listenables: [apiActions],
  init() {
    this.name = 'importStore';
  },

  _mergeToFile(fileId, obj) {
    let f = this.state.getIn(['uploadingFiles', fileId]);
    if ( f ) {
      f = f.merge(obj);
      this.state.setIn(['uploadingFiles', fileId], f);
      this.trigger();
    }
  },


  importFile(params) {
    this._mergeToFile(params.fileId, {importing: true});
  },

  importFileCompleted(params) {
    this._mergeToFile(params.fileId, {
      importing: false,
      imported: true
    });
  },

  importFileFailed(e, params) {
    this._mergeToFile(params.fileId, {
      importing: false,
      importError: (_.isObject(e) && e.text) ? e.text : true
    });
  },


  getFileFieldsCompleted(params, data) {
    this._mergeToFile(params.fileId, {
      status: UPLOADING_FILES_STATUSES.PARSED,
      fileFields: data.fields,
      recordsCount: data.recordsCount
    });
  },

  getFileFieldsFailed(e, params) {
    this._mergeToFile(params.fileId, {
      status: UPLOADING_FILES_STATUSES.ERROR,
      error: (_.isObject(e) && e.text) ? e.text : true
    });
  },



  uploadFile(id, file, catalogId) {
    this.state.setIn(['uploadingFiles', id], Immutable.fromJS({
      id: id,
      status: UPLOADING_FILES_STATUSES.UPLOADING,
      catalogId,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    }));
    this.trigger();
  },

  uploadFileCompleted(fileId, file, path) {
    this._mergeToFile(fileId, {
      status: UPLOADING_FILES_STATUSES.DONE,
      path
    });
  },

  uploadFileFailed(e, fileId, file) {
    this._mergeToFile(fileId, {
      status: UPLOADING_FILES_STATUSES.ERROR,
      error: (_.isObject(e) && e.text) ? e.text : true
    });
  },



  onGetCatalogFieldsCompleted(params, data) {
    let needTrigger;
    let catalogFields;
    let uploadingFiles = this.state.get('uploadingFiles');

    uploadingFiles.forEach((f, id)=> {
      if ( f.get('catalogId') === params.catalogId ) {
        if ( !catalogFields ) {
          catalogFields = new Immutable.List();
          data.fields.forEach((col)=> {
            catalogFields = catalogFields.push(FieldFactory.create(col));
          });
        }
        needTrigger = true;
        f = f.set('catalogFields', catalogFields);
        uploadingFiles = uploadingFiles.set(id, f);
      }
    });

    this.state.set('uploadingFiles', uploadingFiles);

    if ( needTrigger ) {
      this.trigger();
    }
  }

});

window.importStore = importStore;

export default importStore;
