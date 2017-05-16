import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ReactDOM from 'react-dom';
import { DropTarget } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';
import guid from 'guid';
import classNames from 'classnames';

import trs from '../../../getTranslations';
import UPLOADING_FILES_STATUSES from '../../../configs/uploadingFileStatuses';
import apiActions from '../../../actions/apiActions';

const log = require('debug')('CRM:Component:catalogData:Import:StepFile');

const dropTarget = DropTarget(NativeTypes.FILE, {
  drop(props, monitor, component) {
    let item = monitor.getItem();

    // Do something with files
    component.setState({
      disabled: true,
      file: item.files[0],
      id: guid.raw()
    });
  },
  canDrop(props) {
    return !props.disabled;
  }
}, function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
});

const StepFile = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    appState: React.PropTypes.object.isRequired,
    catalogId: React.PropTypes.string.isRequired,
    onImportDone: React.PropTypes.func.isRequired,
    changeStep: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      disabled: false,
      file: null,
      id: null
    };
  },

  onChangeFile(e) {
    log(e.target.files);
    if ( e.target.files[0] ) {
      this.setState({
        file: e.target.files[0],
        disabled: true,
        id: guid.raw()
      });
    }
  },

  onClickCancel() {
    this.setState({
      disabled: false,
      file: null,
      id: null
    });
  },

  onClickUpload() {
    ReactDOM.findDOMNode(this.refs.input).click();
  },

  componentDidUpdate(prevProps, prevState) {
    if ( !prevState.file && this.state.file ) {
      apiActions.uploadFile(this.state.id, this.state.file, this.props.catalogId);
    }
  },

  componentWillReceiveProps(nextProps) {
    var uploadingFile = this.state.id && nextProps.appState.getIn(['uploadingFiles', this.state.id]);
    var status = uploadingFile && uploadingFile.get('status');
    if ( status === UPLOADING_FILES_STATUSES.DONE ) {
      apiActions.getFileFields({path:uploadingFile.get('path'), fileId: this.state.id});
    } else if ( status === UPLOADING_FILES_STATUSES.ERROR ) {
      this.setState({
        uploadError: uploadingFile.get('error') || true
      });
    } else if ( status === UPLOADING_FILES_STATUSES.PARSED ) {
      this.props.changeStep(1, this.state.id);
    }
  },

  render() {
    const { connectDropTarget, isOver, isDragging } = this.props;

    var classes = classNames({
      'modal-import__drop': true,
      'modal-import__drop--hovering': !this.state.disabled && isOver,
      'modal-import__drop--dragging': !this.state.disabled && isDragging
    });

    var infoClasses = classNames({
      'modal-window__drop-info': true,
      'modal-window__drop-info--loading': !this.state.uploadError && this.state.file,
      'modal-window__drop-info--error': this.state.uploadError
    });

    return (
      <div className="modal-import__step modal-import__step--file">
        {connectDropTarget(
        <div className={classes} >
          <div className={infoClasses}>
            <div className="modal-window__drop-info-inner">
              <p className="modal-window__drop-info-types">{trs('import.file.uploadTypes')}</p>
              <p className="modal-window__drop-info-help">{trs('import.file.uploadInfo')}</p>
              <p className="modal-window__drop-info-or">{trs('import.file.uploadOr')}</p>

              <button className="modal-window__drop-info-btn btn" onClick={this.onClickUpload} >{trs('import.file.uploadButton')}</button>
              <input className="modal-window__drop-info-input" type="file" ref="input" onChange={this.onChangeFile} />
            </div>

            <div className="modal-window__drop-info-file">
              <p>
                <img src="/modules/crm/images/loader.gif" />
                <span>{this.state.file && this.state.file.name}</span>
              </p>
              <button className="modal-window__drop-info-btn btn" onClick={this.onClickCancel} >{trs('import.file.uploadCancel')}</button>
            </div>

            <div className="modal-window__drop-info-error">
              <p>
                <span>{trs('import.file.uploadError') + ' ' + (this.state.file && this.state.file.name)}</span>
              </p>
              <button className="modal-window__drop-info-btn btn" onClick={this.onClickCancel} >{trs('import.file.uploadRetry')}</button>
            </div>

          </div>
        </div>
        )}
      </div>
    );
  }

});

export default dropTarget(StepFile);
