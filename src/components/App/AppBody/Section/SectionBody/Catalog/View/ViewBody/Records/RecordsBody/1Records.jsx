import React from 'react'
import PropTypes from 'prop-types'
import Immutable from 'immutable'
import Record from './Record'
import FIELD_TYPES from '../../../../../../../../../../configs/fieldTypes'

function getDropdownItemsById(map, fields) {
  fields.forEach((field) => {
    let type = field.get('type');
    if (type === FIELD_TYPES.DROPDOWN || type === FIELD_TYPES.RADIOBUTTON || type === FIELD_TYPES.CHECKBOXES) {
      field.getIn(['config', 'items']).forEach((item) => map = map.set(field.get('id') + ':' + item.get('id'), item));
    }
  });
  return map;
}

const Records = React.createClass({
  propTypes: {
    records: PropTypes.object.isRequired,
    fields: PropTypes.object.isRequired,
    fieldsWidth: PropTypes.object.isRequired,
    fieldsToRender: PropTypes.object.isRequired,
  },

  getInitialState() {
    var itemsMap = new Immutable.Map({});
    return {
      dropdownItemsById: getDropdownItemsById(itemsMap, this.props.fields)
    };
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.fieldsToRender !== this.props.fieldsToRender) {
      this.setState({
        dropdownItemsById: getDropdownItemsById(this.state.dropdownItemsById, this.props.fields)
      });
    }
  },

  render() {
    var items = this.props.records.map((record, i) => {
      return (
        <Record
          key={i}
          index={i}
          record={record}
          dropdownItemsById={this.state.dropdownItemsById}
          fieldsWidth={i === 0 ? this.props.fieldsWidth : null}
          fieldsToRender={this.props.fieldsToRender}
        />
      );
    });

    return (
      <tbody>
        {items}
      </tbody>
    );
  }

});

export default Records;
