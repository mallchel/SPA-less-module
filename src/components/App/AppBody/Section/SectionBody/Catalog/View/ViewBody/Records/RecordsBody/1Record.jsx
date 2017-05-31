import React from 'react'
import FIELD_TYPES from '../../../../../../../../../../configs/fieldTypes'
import IndexField from './fieldWrappers/IndexField'

const fieldComponentsByType = {
  [FIELD_TYPES.TEXT]: require('../../../../../../../../../common/dataTypes/TextField').default,
  [FIELD_TYPES.NUMBER]: require('./fieldWrappers/NumberField').default,
  [FIELD_TYPES.CONTACT]: require('../../../../../../../../../common/dataTypes/ContactField').default,
  [FIELD_TYPES.DATE]: require('../../../../../../../../../common/dataTypes/DateField').default,
  [FIELD_TYPES.USER]: require('../../../../../../../../../common/dataTypes/UserField').default,
  [FIELD_TYPES.DROPDOWN]: require('../../../../../../../../../common/dataTypes/DropdownField').default,
  [FIELD_TYPES.CHECKBOXES]: require('../../../../../../../../../common/dataTypes/DropdownField').default,
  [FIELD_TYPES.RADIOBUTTON]: require('../../../../../../../../../common/dataTypes/DropdownField').default,
  [FIELD_TYPES.OBJECT]: require('../../../../../../../../../common/dataTypes/ObjectField').default,
  [FIELD_TYPES.FILE]: require('./fieldWrappers/FileField').default,
  [FIELD_TYPES.PROGRESS]: require('../../../../../../../../../common/dataTypes/ProgressField').default,
  [FIELD_TYPES.STARS]: require('../../../../../../../../../common/dataTypes/StarsField').default
};

const Record = React.createClass({
  propTypes: {
    index: React.PropTypes.number.isRequired,
    record: React.PropTypes.object.isRequired,
    fieldsToRender: React.PropTypes.object.isRequired,
    fieldsWidth: React.PropTypes.object,
    onClick: React.PropTypes.func,
    selected: React.PropTypes.bool,
    dropdownItemsById: React.PropTypes.object
  },

  getInitialState() {
    return {
      selected: this.props.selected
    };
  },

  goToRecord(event) {
    // this.props.onClick(this.props.record.get('id'));
  },

  render() {
    let items = [];

    items.push(
      <td key={0}>
        <IndexField index={Number(this.props.record.get('id'))} />
      </td>
    );

    let values = this.props.record.get('values');

    this.props.fieldsToRender.forEach((field) => {
      let type = field.get('type');
      let fieldId = field.get('id');

      let FieldComponent = fieldComponentsByType[type];
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

      //log('config', fieldId, props.config.toJS());

      if (type === FIELD_TYPES.DROPDOWN || type === FIELD_TYPES.RADIOBUTTON || type === FIELD_TYPES.CHECKBOXES) {
        props.dropdownItemsById = this.props.dropdownItemsById;
        props.inContainers = type === FIELD_TYPES.DROPDOWN;
      }

      let width = this.props.fieldsWidth && this.props.fieldsWidth.get(fieldId);

      items.push(
        <td key={fieldId} style={{ width: width ? width + 'px' : null }} className={'data-table__field data-table__field--' + type}>
          <FieldComponent {...props} />
        </td>
      );
    });
    return (
      <tr onClick={this.goToRecord} className={'unit-list__row' + (this.props.selected ? ' selected' : '')}>
        {items}
        <td></td>
      </tr>
    );
  }

});

export default Record;
