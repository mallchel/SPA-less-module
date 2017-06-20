import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import trs from '../../../../../../../../../../getTranslations'
import apiActions from '../../../../../../../../../../actions/apiActions'
import Immutable from 'immutable'
import _ from 'lodash'
import { Upload, Button, Icon } from 'antd'

import recordActions from '../../../../../../../../../../actions/recordActions'

const log = require('debug')('CRM:Component:Record:FileField');

import AddBtn from '../addBtn';
import FileViewer from './fileViewer';

const FileField = React.createClass({
  mixins: [
    PureRenderMixin,
  ],
  propTypes: {
    value: React.PropTypes.object,
    config: React.PropTypes.object,
    readOnly: React.PropTypes.bool,

    catalogId: React.PropTypes.string,
    fieldId: React.PropTypes.string,
    recordId: React.PropTypes.string,
    onSave: React.PropTypes.func.isRequired,
    onUpdate: React.PropTypes.func.isRequired
  },
  //Ссылки на слушатели событий. Нужно для корректной отписки
  uploadListeners: {
    progress: [],
    load: [],
    error: [],
  },

  getInitialState() {
    return {
      imagesRendered: false,
      uploadingFiles: Immutable.fromJS([]),
      values: this.props.value || new Immutable.List()
    };
  },
  async handleFile(e) {
    const file = e.file;
    if (file) {
      await this.uploadFile(file);
    }
  },

  uploadFile(file) {
    let uploadId = Math.random();
    if (!file) return;

    // add file in state
    let params = {
      catalogId: this.props.catalogId,
      fieldId: this.props.fieldId
    };
    //Проверка recordId на то что оно числовое. Причем, может быть строка с цифрами, поэтому просто проверка на int не подойдет
    if (/^\d+$/.test(this.props.recordId)) {
      params.recordId = this.props.recordId;
    }
    log('start uploading file', uploadId);
    let data = {
      name: file.name,
      size: file.size,
      mimeType: file.type,
      typeStorage: 'remoteStorage'
    };


    // set in state
    this.setState({
      uploadingFiles: this.state.uploadingFiles.push(Immutable.fromJS({
        id: uploadId,
        title: file.name,
        loading: '0',
        size: file.size
      }))
    });

    return apiActions
      .uploadFileRecord(params, data, uploadId)
      .then((data) => {
        // make request on s3
        // todo: make configure by type storage.
        log('Link upload file', uploadId, data);
        let fd = new FormData();
        let fileId = data.fileId;

        fd.append('key', data.fileKey);
        fd.append('acl', data.acl);
        // fd.append('success_action_redirect', data.redirect);

        fd.append('Content-Type', "");
        fd.append('AWSAccessKeyId', data.AWSAccessKeyId);
        fd.append('Policy', data.police);
        fd.append('Signature', data.signature);

        fd.append("file", file);

        // todo: defer abort xhr.abort()
        var xhr = this.xhr = new XMLHttpRequest();
        let progressListener = (progress) => {
          log('progress file', uploadId, progress);
          this.updateProgress(progress, uploadId);
        };
        xhr.upload.addEventListener("progress", progressListener, false);
        this.uploadListeners.progress.push(progressListener);
        let _data = data;
        let loadListener = (res) => {
          let data = {
            name: file.name,
            size: file.size,
            mimeType: file.type,
            url: _data.fileKey
          };
          apiActions
            .updateFileRecord({ fileId }, data).then((res) => {
              let newView = {
                id: res.id,
                title: res.title,
                mimeType: res.mimeType,
                size: file.size,
                url: res.url
              };
              this.completeUpload(uploadId, newView);
            });
        };
        xhr.addEventListener("load", loadListener, false);
        this.uploadListeners.load.push(loadListener);
        let errorListener = (data) => {
          log('error', arguments);
          this.setErrorOnFile(uploadId);
        };
        xhr.addEventListener("error", errorListener, false);
        this.uploadListeners.error.push(errorListener);
        xhr.addEventListener("abort", function uploadCanceled(data) {
          log('abort', arguments);
          // this.removeUploadingFile({id: uploadId});
        }, false);

        xhr.open('POST', data.uploadUrl, true);
        xhr.send(fd);
      })
      .catch(() => {
        // remove if failed create.
        this.removeUploadingFile({ id: uploadId });
      });

  },

  onSave(data) {
    const newValue = data.toJS();
    this.props.onSave(newValue);
    this.props.onUpdate(newValue);
  },

  completeUpload(uploadId, newFile) {
    this.removeUploadingFile({ id: uploadId });
    log('upload file complete', uploadId);
    let newValues = this.state.values.push(Immutable.fromJS(newFile));
    this.setState({
      values: newValues
    }, () => {
      // onSave.
      this.onSave(newValues);
      recordActions.clearErrorField(this.props.catalogId, this.props.recordId, this.props.fieldId);
    });
  },

  updateProgress(progress, uploadId) {
    let uploadingFiles = this.state.uploadingFiles.map(f => {
      if (f.get('id') == uploadId) {
        f = f.set('loading', (progress.loaded / progress.total * 100).toFixed(2));
      }
      return f;
    });
    this.setState({
      uploadingFiles: uploadingFiles
    });
  },

  setErrorOnFile(uploadId) {
    let uploadingFiles = this.state.uploadingFiles.map(f => {
      if (f.get('id') == uploadId) {
        f = f.set('error', true);
        //f = f.delete('loading');
      }
      return f;
    });

    this.setState({
      uploadingFiles: uploadingFiles
    });
  },

  removeUploadingFile(file) {
    let index = this.state.uploadingFiles.findIndex(f => f.get('id') === file.id);
    if (index !== -1) {
      this.setState({
        uploadingFiles: this.state.uploadingFiles.delete(index)
      });
    }
  },

  onClickRemoveFile(file) {
    if (file.loading) {
      this.removeUploadingFile(file);
    } else {
      let index = this.state.values.findIndex(f => f.get('id') == file.id);

      if (index !== -1) {
        let newValues = this.state.values.delete(index);

        this.setState({
          values: newValues
        }, () => {
          this.onSave(newValues);
        });

        apiActions.removeFileRecord({ fileId: file.id });
      }
    }
  },

  componentWillReceiveProps(nextProps) {
    if (!Immutable.is(nextProps.value, this.props.value)) {
      this.setState({
        values: Immutable.fromJS(nextProps.value) || new Immutable.List()
      });
    }
  },

  componentWillUnmount() {
    if (this.xhr) {
      this.xhr.abort();
      //Очистка всех листенеров
      _.forOwn(this.uploadListeners, (listeneres, event) => {
        _.forEach(listeneres, (listener) => {
          this.xhr.removeEventListener(event, listener);
        });
        this.uploadListeners[event] = [];
      });
    }
  },

  render() {
    let values = (this.state.values && this.state.values.toJS() || []).concat(this.state.uploadingFiles.toJS());
    let readOnly = this.props.readOnly;

    return (
      <div className="record-file">
        <div className="record-file__items">
          <FileViewer
            files={values}
            readOnly={readOnly}
            removeFn={this.onClickRemoveFile}
          />
        </div>

        {!readOnly && (this.props.config.get('multiselect') || values.length === 0)
          ?
          <Upload
            customRequest={this.handleFile}
            showUploadList={false}
            multiple={this.props.config.get('multiselect')}
          >
            <AddBtn
              className="record-file__upload-link"
              caption={trs('record.fields.file.upload')}
            />
          </Upload>
          : null
        }
      </div>
    );
  }
});

export default FileField;
