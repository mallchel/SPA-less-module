import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Reflux from 'reflux';
import RecordData from './RecordData';
import appState from '../../appState';
import apiActions from '../../actions/apiActions';
import RecordActions from '../../actions/recordActions';
import FieldErrorsStore from '../../stores/FieldErrorsStore';
import getRecordHeaderText from '../../utils/getRecordHeaderText';
import trs from '../../getTranslations';
import Loading from '../common/Loading';
import Immutable from 'immutable';

import modalsActions from '../../actions/modalsActions'

const log = require('debug')('CRM:Component:Record:Modal:New');

const RecordModal = React.createClass({
  mixins: [PureRenderMixin,Reflux.listenTo(FieldErrorsStore, 'onErrors')],
  propTypes: {
    recordId: React.PropTypes.string.isRequired,
    catalogId: React.PropTypes.string,
    recordName: React.PropTypes.string,
    appState: React.PropTypes.object.isRequired
  },

  getInitialState() {
    let record = this.props.appState.getIn(['records', this.props.catalogId, this.props.recordId]);
    return {
      saving: record && record.get('saving'),
      saveError: record && record.get('saveError'),
      saveEnabled: true,
      edited: false
    };
  },

  onSaveField({catalogId, recordId, fieldId, data}) {
    log('Record %s OnSaveField %s value', recordId, fieldId, data);
    RecordActions.updateRecordValue(catalogId, recordId, fieldId, data);
    this.setState({
      edited: true,
      saveEnabled: true
    });
  },
  onErrors() {
    this.setState({
      saving: false
    });
  },
  onClickSave() {
    this.setState({
      saveEnabled: false,
      saving: true
    });

    let success = result=> {
      this.props.closeModal();
      if (!this.props.allowClose) {
        modalsActions.openRecordModal(
          this.props.catalogId,
          result.id,
          this.getHeaderText(),
          false
        )
      }
      if (this.props.onSave) {
        this.props.onSave(result);
      }
    };
    let values = appState.getIn(['records', this.props.catalogId, this.props.recordId, 'values']);
    if (values) {
      RecordActions.validateAndSaveRecord(this.props.catalogId, this.props.recordId, values.toJS(), success);
    }
  },

  onClickCancel() {
    this.props.allowClose && this.props.closeModal();
  },


  componentWillReceiveProps(nextProps) {
    //log('componentWillReceiveProps');
    //let record = nextProps.appState.getIn(['records', this.props.catalogId, this.props.recordId]);
    //let actualValues = this.state.changedValues.toJS();
    //let values =  record.get('values').toJS() || {};
    //if (values) {
    //  this.setState({edited: true});
    //}
    //_.forEach(values, (f, id) => {
    //  if (!actualValues[id]) {
    //    actualValues[id] = values[id];
    //  }
    //});
    //this.setState({
    //  record: record,
    //  changedValues: Immutable.fromJS(actualValues),
    //  saving: record.get('saving'),
    //  saveError: record.get('saveError')
    //});
  },

  componentDidMount() {
    apiActions.getCatalog({catalogId: this.props.catalogId});
  },

  getHeaderText() {
    let record = this.state.record;
    let isNew = (!record && this.props.isNewRecord) || (record && record.get('isNew'));
    return getRecordHeaderText(record) || this.props.recordName;
  },

  render() {
    let saveEnabled = this.state.saveEnabled;
    let record = appState.getIn(['records', this.props.catalogId, this.props.recordId]);

    let isNew = (!record && this.props.isNewRecord) || (record && record.get('isNew'));
    let headerText = this.getHeaderText();
    let headerItalic = isNew && !headerText;

    if (!headerText) {
      headerText = isNew ? trs('record.newRecord') : trs('record.emptyRecordName');
    }

    let copyright = (
      <small className="m-text_light record-modal__copyright">
        {trs('record.copyrightPrefix')}
        <a className="m-text_light" href="//bpium.ru" target="_blank">{trs('record.copyright')}</a>
      </small>
    );

    return (
      <div className="record-modal__container">
        <header className="modal-window__header">
          {
            this.props.allowClose &&
            <i className="modal-window__header__close" onClick={this.onClickCancel}/>
          }

          <h2 className={'modal-window__header__title' + (headerItalic ? ' modal-window__header__title--italic' : '')}>
            {headerText}&nbsp;
          </h2>
        </header>
        <div className="record-modal__wrapper">
          { record ?
            <RecordData
              isNew={isNew}
              disableAutoSave={true}
              unsavedFields={this.props.unsavedFields}
              onSaveField={this.onSaveField}
              record={record}
              catalogId={this.props.catalogId}
              readOnly={false}
            /> :
            <Loading fullHeight={true}/>
          }
        </div>
        <footer className="modal-window__footer">
          <button disabled={!saveEnabled || this.state.saving} className="btn" onClick={this.onClickSave}>
            {this.state.saving ? trs('record.actions.saving') : trs('record.actions.save')}
          </button>
          {
            this.props.allowClose &&
            <a className="m-like-button ng-click-active" href="javascript:void(0)" onClick={this.onClickCancel}>
              {trs('record.actions.cancel')}
            </a>
          }
          <span className="record-modal__error">{this.state.saveError ? trs('record.actions.saveError') : ''}</span>
          {this.state.saveError ? '' : copyright}
        </footer>
      </div>
    );
  }

});

export default RecordModal;
