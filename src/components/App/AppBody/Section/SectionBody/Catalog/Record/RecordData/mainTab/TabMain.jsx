import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import classNames from 'classnames'
import Immutable from 'immutable'
import PropTypes from 'prop-types'

import FIELD_TYPES from '../../../../../../../../../configs/fieldTypes'
import appState from '../../../../../../../../../appState'
import Section from './Section'

import TabLinkedData from '../linkedDataTab/TabLinkedData'

const log = require('debug')('CRM:Component:Record:TabMain');

const TabMain = React.createClass({
  // mixins: [PureRenderMixin],
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

  render() {
    console.log('tabMain')
    let sections = [];
    let _curGroup;
    const values = this.props.record.get('values');
    const fields = this.props.catalog.get('fields');
    const recordId = this.props.record.get('id') || appState.getIn(['newRecordId', this.props.catalogId]);
    const catalogId = this.props.catalog.get('id');

    if (fields) {
      fields.forEach((field) => {
        if (field.get('type') === FIELD_TYPES.GROUP) {
          _curGroup = {
            id: field.get('id'),
            section: field,
            fields: [],
            values: {}
          };
          sections.push(_curGroup);
        } else {
          if (!_curGroup) {
            _curGroup = {
              id: '',
              section: Immutable.fromJS({ name: '', type: FIELD_TYPES.GROUP }),
              fields: [],
              values: {}
            };
            sections.push(_curGroup);
          }
          _curGroup.fields.push(field);
          _curGroup.values[field.get('id')] = values && values.get(field.get('id'));
        }
      });
    }

    let sectionsComponents = sections.map((sec) => {
      return <Section
        key={sec.id}
        disableAutoSave={this.props.disableAutoSave}
        recordId={recordId}
        record={this.props.record}
        catalogId={catalogId}
        section={sec.section}
        fields={sec.fields}
        values={sec.values}
        unsavedFields={this.props.unsavedFields}
        onSaveField={this.onSaveField}
        readOnly={this.props.readOnly} />
    });

    let tabLinkedData = !this.props.isNewRecord && <TabLinkedData {...this.props} catalogId={catalogId} />;

    let linkedData = this.props.record.get('linkedData');

    let containerClasses = classNames('record-content-container', {
      'record-content-container--no-linked-data': !(linkedData && linkedData.size)
    });

    return (
      <div className={containerClasses}>
        <ul>
          {sectionsComponents}
        </ul>

        {tabLinkedData}
      </div>
    );
  }
});

export default TabMain;
