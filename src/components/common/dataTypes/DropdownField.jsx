import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Items from './Items';
import _ from 'lodash';

const DropdownField = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    value: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.string
    ]),
    config: React.PropTypes.object,
    dropdownItemsById: React.PropTypes.object,
    inContainers: React.PropTypes.bool,
    fieldId: React.PropTypes.string.isRequired,
    fieldType: React.PropTypes.string.isRequired
  },

  render() {

    let values = [];
    let fieldValues = _.isObject(this.props.value) ? this.props.value.toJS() : this.props.value;
    if ( !_.isArray(fieldValues) ) {
      fieldValues = fieldValues ? [fieldValues] : [];
    }
    fieldValues.forEach((val)=> {
      values.push({
        name: this.props.dropdownItemsById.getIn([this.props.fieldId + ':' + val, 'name']),
        color: this.props.dropdownItemsById.getIn([this.props.fieldId + ':' + val, 'color'])
      });
    });

    return (
      <Items values={values} inContainers={this.props.inContainers} fieldType={this.props.fieldType}/>
    );
  }
});

export default DropdownField;
