import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import classNames from 'classnames'
// import Immutable from 'immutable'
import PropTypes from 'prop-types'

import FIELD_TYPES from '../../../../../../../../../configs/fieldTypes'
// import appState from '../../../../../../../../../appState'
// import Section from './Section'
import ControlList from '../../../../../../../../common/UI/ControlList'
import recordActions from '../../../../../../../../../actions/recordActions'
import { connect } from '../../../../../../../../StateProvider'

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

  onSaveField(fieldId, data) {
    log('Change %s', fieldId, data)
    this.props.onSaveField({
      catalogId: this.props.catalogId,
      recordId: this.props.record.get('id'),
      fieldId,
      data
    });
  },

  mapFields(fields) {
    if (fields) {
      const catalogId = this.props.catalogId;
      const recordId = this.props.record.get('id');
      return fields.map((field) => {
        const fieldId = field.get('id');
        let readonly = this.props.readOnly;
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
              readonly = false;
              break;
            case 'view':
              readonly = true;
              break;
            default:
              break;
          }
        }

        if (field.get('apiOnly')) {
          readonly = true;
        }
        switch (field.get('type')) {
          case FIELD_TYPES.TEXT:
            return {
              readOnly: readonly,
              config: field.get('config'),
              hint: field.get('hint'),
              id: field.get('id'),
              name: field.get('name'),
              onBlur: () => {
                recordActions.clearErrorField(this.props.catalog.get('id'), recordId || this.props.newRecordId.get(catalogId), field.get('id'))
              },
              required: field.get('required'),
              type: field.get('type'),
              visible: field.get('visible')
            }
          default:
            break;
        }
      });
    }
  },

  render() {
    // let sections = [];
    // let _curGroup;
    const values = this.props.record.get('values');
    const fields = this.props.catalog.get('fields');
    const recordId = this.props.record.get('id') || this.props.newRecordId.get(this.props.catalogId);
    const catalogId = this.props.catalog.get('id');

    // let sectionsComponents = sections.map((sec) => {
    //   return <Section
    //     key={sec.id}
    //     disableAutoSave={this.props.disableAutoSave}
    //     recordId={recordId}
    //     record={this.props.record}
    //     catalogId={catalogId}
    //     section={sec.section}
    //     fields={sec.fields}
    //     values={sec.values}
    //     unsavedFields={this.props.unsavedFields}
    //     onSaveField={this.onSaveField}
    //     readOnly={this.props.readOnly} />
    // });

    // const sectionsComponents = sections.map((sec) => {
    //   return <Controls
    //     key={sec.id}
    //     disableAutoSave={this.props.disableAutoSave}
    //     recordId={recordId}
    //     record={this.props.record}
    //     catalogId={catalogId}
    //     section={sec.section}
    //     fields={sec.fields}
    //     values={sec.values}
    //     unsavedFields={this.props.unsavedFields}
    //     onSaveField={this.onSaveField}
    //     readOnly={this.props.readOnly}
    //   />
    // });

    let tabLinkedData = !this.props.isNewRecord && <TabLinkedData {...this.props} catalogId={catalogId} />;

    let linkedData = this.props.record.get('linkedData');

    let containerClasses = classNames('record-content-container', {
      'record-content-container--no-linked-data': !(linkedData && linkedData.size)
    });

    return (
      <div className={containerClasses}>
        <ControlList data={values} meta={this.mapFields(fields)} />
        {/*<div>
          {sectionsComponents}
        </div>*/}
        {tabLinkedData}
      </div>
    );
  }
});

export default connect(TabMain, ['records', 'newRecordId']);
