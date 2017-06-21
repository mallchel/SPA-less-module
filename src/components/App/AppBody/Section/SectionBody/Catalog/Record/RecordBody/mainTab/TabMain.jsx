import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import classNames from 'classnames'
import Immutable from 'immutable'
import _ from 'lodash'
import PropTypes from 'prop-types'

import FIELD_TYPES from '../../../../../../../../../configs/fieldTypes'
// import appState from '../../../../../../../../../appState'
// import Section from './Section'
import ControlList from '../../../../../../../../common/UI/ControlList'
import recordActions from '../../../../../../../../../actions/recordActions'
import { connect } from '../../../../../../../../StateProvider'
import apiActions from '../../../../../../../../../actions/apiActions'

import TabLinkedData from '../linkedDataTab/TabLinkedData'

const log = require('debug')('CRM:Component:Record:TabMain');

const TabMain = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    record: PropTypes.object.isRequired,
    catalog: PropTypes.object,
    onSaveField: PropTypes.func,
    unsavedFields: PropTypes.object,
    disableAutoSave: PropTypes.bool,
    isNewRecord: PropTypes.bool,
    readOnly: PropTypes.bool
  },

  onSaveField(controlId, data) {
    log('Change %s', controlId, data);
    const catalogId = this.props.catalog.get('id');
    const recordId = this.props.record.get('id');
    const field = this.props.catalog.get('fields').find(f => f.get('id') === controlId);

    if (field.get('eventable')) {
      recordActions.shouldUpdateProcess(catalogId, recordId, controlId);
    }

    this.props.onSaveField({
      catalogId: catalogId,
      recordId: recordId,
      fieldId: controlId,
      data
    });
  },

  onUpdateField(controlId, data) {
    const catalogId = this.props.catalog.get('id');
    const record = this.props.record;
    const recordId = record.get('id');
    const field = this.props.catalog.get('fields').find(f => f.get('id') === controlId);
    const updateProcess = record.getIn(['updateProcesses', 'fields']).get(controlId);

    if (field.get('eventable') && updateProcess && updateProcess.get('shouldProcess')) {
      const realRecordId = record.get('isNew') ? null : recordId;
      const values = { [controlId]: data };
      const allValues = Object.assign(record.get('values').toJS(), values);

      apiActions.createChange({
        catalogId,
        recordId: realRecordId || '$new'
      }, {
          values,
          allValues
        }, {
          recordId,
          fieldId: controlId
        });
    }

    recordActions.clearErrorField(catalogId, recordId || this.props.newRecordId.get(catalogId));
  },

  mapFields(fields) {
    if (fields) {
      const catalogId = this.props.catalogId;
      const recordId = this.props.record.get('id');
      const errors = this.props.record.get('errors');

      return fields.map((field) => {
        const fieldId = field.get('id');
        let readOnly = this.props.readOnly;
        // Переопределние на основе индивидуальных прав на поле
        let specialPrivilege = this.props.records.getIn([
          catalogId,
          recordId,
          'fieldPrivilegeCodes',
          fieldId
        ]);

        if (!specialPrivilege) {
          specialPrivilege = this.props.catalog.getIn(['views', this.props.match.params.viewId, 'fieldPrivilegeCodes', fieldId]);
        }

        if (specialPrivilege) {
          switch (specialPrivilege) {
            case 'edit':
              readOnly = false;
              break;
            case 'view':
              readOnly = true;
              break;
            default:
              break;
          }
        }

        if (field.get('apiOnly')) {
          readOnly = true;
        }

        // let controlError = null;
        // _.forEach(this.state.errors, (error) => {
        //   if (error.fieldId === fieldId) {
        //     controlError = error.error;
        //   }
        // });

        field = field.set('readOnly', readOnly);
        return field.set('error', errors[fieldId]);

        // switch (field.get('type')) {
        //   case FIELD_TYPES.TEXT:
        //     //return //field.set('readOnly', readOnly);
        //     return {

        //     }
        //   default:
        //     return field.set('readOnly', readOnly);
        // }
      });
    }
  },

  render() {
    const values = this.props.record.get('values');
    const fields = this.props.catalog.get('fields');
    const catalogId = this.props.catalog.get('id');

    let tabLinkedData = !this.props.isNewRecord && <TabLinkedData {...this.props} catalogId={catalogId} />;

    let linkedData = this.props.record.get('linkedData');

    let containerClasses = classNames('record-content-container', {
      'record-content-container--no-linked-data': !(linkedData && linkedData.size)
    });

    return (
      <div className={containerClasses}>
        <ControlList
          values={values}
          configs={this.mapFields(fields)}
          onSaveField={this.onSaveField}
          onUpdateField={this.onUpdateField}
        />
        {tabLinkedData}
      </div>
    );
  }
});

export default connect(TabMain, ['records', 'newRecordId']);
