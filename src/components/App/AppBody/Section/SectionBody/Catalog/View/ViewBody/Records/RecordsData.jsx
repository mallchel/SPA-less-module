import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDataGrid from 'react-data-grid'
import FIELD_TYPES from '../../../../../../../../../configs/fieldTypes'

const fieldComponentsByType = {
  [FIELD_TYPES.TEXT]: require('../../../../../../../../common/dataTypes/TextField').default,
  [FIELD_TYPES.NUMBER]: require('./RecordsBody/fieldWrappers/NumberField').default,
  [FIELD_TYPES.CONTACT]: require('../../../../../../../../common/dataTypes/ContactField').default,
  [FIELD_TYPES.DATE]: require('../../../../../../../../common/dataTypes/DateField').default,
  [FIELD_TYPES.USER]: require('../../../../../../../../common/dataTypes/UserField').default,
  [FIELD_TYPES.DROPDOWN]: require('../../../../../../../../common/dataTypes/DropdownField').default,
  [FIELD_TYPES.CHECKBOXES]: require('../../../../../../../../common/dataTypes/DropdownField').default,
  [FIELD_TYPES.RADIOBUTTON]: require('../../../../../../../../common/dataTypes/DropdownField').default,
  [FIELD_TYPES.OBJECT]: require('../../../../../../../../common/dataTypes/ObjectField').default,
  [FIELD_TYPES.FILE]: require('./RecordsBody/fieldWrappers/FileField').default,
  [FIELD_TYPES.PROGRESS]: require('../../../../../../../../common/dataTypes/ProgressField').default,
  [FIELD_TYPES.STARS]: require('../../../../../../../../common/dataTypes/StarsField').default
};

class RecordsData extends Component {
  static PropTypes = {
    fields: PropTypes.array,
    records: PropTypes.array
  }

  rowGetter = (i) => {
    console.log(this.values)
    return this.values[i];
  }

  render() {
    let records = {};
    this.values = this.props.records.map((record, i) => {
      let values = record.get('values');
      records = {};
      this.props.fields.forEach((field) => {
        const type = field.get('type');
        const fieldId = field.get('id');

        const FieldComponent = fieldComponentsByType[type];
        if (!FieldComponent) {
          return;
        }

        let value = values.get(fieldId);
        let props = {
          fieldId,
          value,
          config: field.get('config'),
          fieldType: type
        };

        if (type === FIELD_TYPES.DROPDOWN || type === FIELD_TYPES.RADIOBUTTON || type === FIELD_TYPES.CHECKBOXES) {
          props.dropdownItemsById = this.props.dropdownItemsById;
          props.inContainers = type === FIELD_TYPES.DROPDOWN;
        }
        records[fieldId] = <td>
          <FieldComponent {...props} />
        </td>

        // this.header.push({
        //   key: fieldId,
        //   name: fieldName
        // })
      });
      return records;
    }).toJS();

    const columns = this.props.fields.toJS().map(field => {
      return {
        key: field.id,
        name: field.name
      }
    });
    // this.records = this.props.records.toJS().map(record => {
    //   return record.values;
    // })
    console.log(columns, this.values)
    return (
      this.values
        ?
        <ReactDataGrid
          columns={columns}
          rowGetter={this.rowGetter}
          rowsCount={this.values.length}
          minHeight={500}
        />
        :
        null
    )
  }
}

export default RecordsData;
