import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Reflux from 'reflux'
import Immutable from 'immutable'
import _ from 'lodash'
import RecordData from './RecordData'
import apiActions from '../../../../../../../actions/apiActions'
import RecordActions from '../../../../../../../actions/recordActions'
import FieldErrorsStore from '../../../../../../../stores/FieldErrorsStore'
import getRecordHeaderText from '../../../../../../../utils/getRecordHeaderText'
import trs from '../../../../../../../getTranslations'
import Loading from '../../../../../../common/Loading'
import appState from '../../../../../../../appState'

import { checkAccessOnObject } from '../../../../../../../utils/rights'
import PRIVILEGE_CODES from '../../../../../../../configs/privilegeCodes'
import RESOURCE_TYPES from '../../../../../../../configs/resourceTypes'

const log = require('debug')('CRM:Component:Record:Modal');

const RecordModal = React.createClass({
  mixins: [PureRenderMixin, Reflux.listenTo(FieldErrorsStore, 'onErrors')],
  propTypes: {
    recordId: React.PropTypes.string.isRequired,
    catalogId: React.PropTypes.string.isRequired,
    recordName: React.PropTypes.string,
    appState: React.PropTypes.object.isRequired,
    allowClose: React.PropTypes.bool.isRequired
  },
  changedFields: [],
  getInitialState() {
    let record = appState.getIn(['records', this.props.catalogId, this.props.recordId]);
    return {
      saving: record && record.get('saving'),
      saveError: record && record.get('saveError'),
      saveEnabled: false
      // originalFields: Immutable.fromJS({})
    };
  },

  onSaveField({ fieldId, data }) {
    log('Save field %s value ', fieldId, data);
    let newValue = Immutable.fromJS(data);
    appState.setIn(['records', this.props.catalogId, this.props.recordId, 'values', fieldId], newValue);
    if (this.changedFields.indexOf(fieldId) === -1) {
      this.changedFields.push(fieldId);
    }
    this.setState({
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
    let newValues = appState.getIn(['records', this.props.catalogId, this.props.recordId, 'values']);
    let oldValues = appState.getIn(['records', this.props.catalogId, this.props.recordId, 'originValues']);
    let values = newValues.filter((newValue, fieldId) => {
      let oldValue = oldValues.get(fieldId);
      return _.isObject(newValue)
        ? !Immutable.is(newValue, oldValue)
        : newValue !== oldValue;
    });
    RecordActions.validateAndSaveRecord(this.props.catalogId, this.props.recordId, values.toJS());
  },

  onClickCancel() {
    this.props.allowClose && this.props.closeModal();
  },


  componentWillReceiveProps(nextProps) {
    log('componentWillReceiveProps');
    let record = nextProps.appState.getIn(['records', this.props.catalogId, this.props.recordId]);

    this.setState({
      saving: record.get('saving'),
      saveError: record.get('saveError')
    });
  },

  componentDidMount() {
    log('did mount');

    apiActions
      .getRecord({ recordId: this.props.recordId, catalogId: this.props.catalogId })
      .then(
      () => {
        apiActions.getCatalog({ catalogId: this.props.catalogId });
      },
      (error) => {
        this.props.allowClose && this.props.closeModal()
      });
  },

  render() {
    let record = appState.getIn(['records', this.props.catalogId, this.props.recordId]);
    let saveEnabled = this.state.saveEnabled;
    let readOnly = true;

    if (record) {
      let values = record.get('values');
      if (record.getIn(['id'])) {
        readOnly = !checkAccessOnObject(RESOURCE_TYPES.RECORD, record, PRIVILEGE_CODES.EDIT) && !record.get('fieldPrivilegeCodes').find((e) => e == 'edit');
      } else {
        readOnly = false;
      }
    }

    let isNew = (!record && this.props.isNewRecord) || (record && record.get('isNew'));
    let headerText = getRecordHeaderText(record) || this.props.recordName;
    let headerItalic = isNew && !headerText;
    if (!headerText) {
      headerText = isNew ? trs('record.newRecord') : trs('record.emptyRecordName');
    }

    let buttonCancel = this.props.allowClose && (
      <a className="m-like-button ng-click-active" href="javascript:void(0)" onClick={this.onClickCancel}>
        {trs('modals.close')}
      </a>
    );

    let copyright = (
      <small className="m-text_light record-modal__copyright">
        {trs('record.copyrightPrefix')}
        <a className="m-text_light" href="//bpium.ru" target="_blank">{trs('record.copyright')}</a>
      </small>
    );

    let footer;
    if (readOnly) {
      footer =
        <footer className="modal-window__footer">
          {buttonCancel}
          {copyright}
        </footer>;
    } else {
      footer =
        <footer className="modal-window__footer">
          <button disabled={!saveEnabled || this.state.saving} className="btn" onClick={this.onClickSave}>
            {this.state.saving ? trs('record.actions.saving') : trs('record.actions.save')}
          </button>
          {buttonCancel}
          <span className="record-modal__error">{this.state.saveError ? trs('record.actions.saveError') : ''}</span>
          {copyright}
        </footer>;
    }

    return (
      <div className="record-modal__container">
        <header className="modal-window__header">
          {
            this.props.allowClose &&
            <i className="modal-window__header__close" onClick={this.onClickCancel}></i>
          }

          <h2 className={'modal-window__header__title' + (headerItalic ? ' modal-window__header__title--italic' : '')}>
            {headerText}&nbsp;
          </h2>
        </header>
        <div className="record-modal__wrapper">
          {record && record.get('fields')
            ? <RecordData
              isNew={isNew}
              disableAutoSave={true}
              unsavedFields={this.props.unsavedFields}
              onSaveField={this.onSaveField}
              record={record}
              catalogId={this.props.catalogId}
              readOnly={readOnly} />
            : <Loading fullHeight={true} />
          }
        </div>
        {footer}
      </div>
    );
  }

});

export default RecordModal;
