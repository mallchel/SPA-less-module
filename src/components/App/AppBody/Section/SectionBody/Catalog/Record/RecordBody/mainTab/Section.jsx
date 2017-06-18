import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Reflux from 'reflux'
import classNames from 'classnames'
import _ from 'lodash'
import { Row } from 'antd'
import trs from '../../../../../../../../../getTranslations'
import FIELD_TYPES from '../../../../../../../../../configs/fieldTypes'
import FieldErrorsStore from '../../../../../../../../../stores/FieldErrorsStore'
import appState from '../../../../../../../../../appState'
import apiActions from '../../../../../../../../../actions/apiActions'
import recordActions from '../../../../../../../../../actions/recordActions'

import styles from './mainTab.less'

import Field from './Field'

const log = require('debug')('CRM:Component:Record:Section');

const fieldComponentsByType = {
  [FIELD_TYPES.TEXT]: require('./fields/TextField').default,
  [FIELD_TYPES.CONTACT]: require('./fields/ContactField').default,
  [FIELD_TYPES.NUMBER]: require('./fields/NumberField').default,
  [FIELD_TYPES.DATE]: require('./fields/DateField').default,

  [FIELD_TYPES.DROPDOWN]: require('./fields/DropdownField').default,
  [FIELD_TYPES.CHECKBOXES]: require('./fields/CheckboxesField').default,
  [FIELD_TYPES.RADIOBUTTON]: require('./fields/RadiobuttonField').default,

  [FIELD_TYPES.PROGRESS]: require('./fields/ProgressField').default,
  [FIELD_TYPES.STARS]: require('./fields/StarsField').default,

  [FIELD_TYPES.OBJECT]: require('./fields/ObjectField').default,
  [FIELD_TYPES.USER]: require('./fields/UserField').default,
  [FIELD_TYPES.FILE]: require('./fields/FileField').default,
};

const Section = React.createClass({
  mixins: [PureRenderMixin, Reflux.listenTo(FieldErrorsStore, 'updateErrorFields')],
  propTypes: {
    record: React.PropTypes.object,
    recordId: React.PropTypes.string,
    catalogId: React.PropTypes.string,
    section: React.PropTypes.object.isRequired,
    fields: React.PropTypes.array.isRequired,
    values: React.PropTypes.object.isRequired,
    onSaveField: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      open: true, // TODO: default value
      errors: []
    };
  },

  updateErrorFields(event) {
    if (event.event == 'onErrors') {
      if (event.errors[this.props.catalogId]) {
        this.setState({ errors: event.errors[this.props.catalogId][this.props.recordId] });
      }
      let sectionHasErrors = false;
      this.props.fields.forEach((field) => {
        _.forEach(this.state.errors, (error) => {
          if (error.fieldId == field.get('id')) {
            sectionHasErrors = true;
          }
        });
      });
      if (sectionHasErrors) {
        this.setState({ open: true });
      }
    }
  },

  toggleList() {
    this.setState({
      open: !this.state.open
    });
  },

  onSaveField(fieldId, data) {
    log('onSaveField', data);
    this.props.onSaveField(fieldId, data);

    const field = this.props.fields.find(f => f.get('id') === fieldId);

    if (field.get('eventable')) {
      const { recordId, catalogId } = this.props;
      recordActions.shouldUpdateProcess(catalogId, recordId, fieldId);
    }
  },

  onUpdateField(field, data) {
    if (!field.get('eventable')) {
      return;
    }

    const { recordId, catalogId, record } = this.props;
    const realRecordId = record.get('isNew') ? null : recordId;
    const fieldId = field.get('id');

    log('onUpdateField', { recordId, fieldId, data });

    const values = { [fieldId]: data };
    const allValues = Object.assign(record.get('values').toJS(), values);

    apiActions.createChange({
      catalogId,
      recordId: realRecordId || 'new'
    }, {
        values,
        allValues
      }, {
        recordId,
        fieldId
      });
  },

  render() {
    const { record } = this.props;

    let fieldItems = this.props.fields.map((field) => {
      let FieldComponent = fieldComponentsByType[field.get('type')];
      let fieldError = null;
      let fieldId = field.get('id');
      _.forEach(this.state.errors, (error) => {
        if (error.fieldId == fieldId) {
          fieldError = error.error;
        }
      });
      let readonly = this.props.readOnly;
      //Переопределние на основе индивидуальных прав на поле
      let specialPrivilege = appState.getIn([
        'records',
        this.props.catalogId,
        this.props.recordId,
        'fieldPrivilegeCodes',
        fieldId
      ]);
      if (!specialPrivilege) {
        specialPrivilege = appState.getIn(['currentCatalog', 'currentView', 'fieldPrivilegeCodes', fieldId]);
      }
      if (specialPrivilege) {
        switch (specialPrivilege) {
          case 'edit':
            readonly = false;
            break;
          case 'view':
            readonly = true;
            break
        }
      }

      if (field.get('apiOnly')) {
        readonly = true;
      }

      return (
        <Field key={this.props.catalogId + '_' + this.props.recordId + '_' + field.get('id')}
          value={this.props.values[field.get('id')]}
          name={field.get('name')}
          hint={field.get('hint')}
          required={field.get('required')}
          default={field.get('default')}
          type={field.get('type')}
          readOnly={readonly}
          error={fieldError}
        >
          <FieldComponent
            value={this.props.values[field.get('id')]}
            hint={field.get('hint')}
            required={field.get('required')}
            default={field.get('default')}
            config={field.get('config')}
            fieldId={field.get('id')}
            field={field}
            recordId={this.props.recordId}
            catalogId={this.props.catalogId}
            onSave={(val) => this.onSaveField(field.get('id'), val)}
            onUpdate={(val) => this.onUpdateField(field, val)}
            updateProcess={record.getIn(['updateProcesses', 'fields', field.get('id')])}
            readOnly={readonly}
            error={fieldError}
          />
        </Field>
      );
    });

    return (
      <div>
        <Row type="flex" justify="space-between" className={styles.sectionHeader} onClick={this.toggleList}>
          <span className={styles.headerText}>{this.props.section.get('name')}</span>
          {!this.state.open ? <span className={styles.headerCount}>{trs('record.groupFieldsCount', this.props.fields.length)}</span> : null}
        </Row>
        <div style={!this.state.open ? { display: 'none' } : null} className={styles.sectionFields}>
          {fieldItems}
        </div>
      </div>
    );
  }
});

export default Section;
