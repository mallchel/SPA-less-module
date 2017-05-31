import React from 'react'
import _ from 'lodash'
import Immutable from 'immutable'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import ImmutablePropTypes from 'react-immutable-proptypes'

import Dropdown from '../../../../../../common/Dropdown'

function getValueKey({ type, subType, value }) {
  return type + (subType || '') + (value || '');
}

const BasicSelect = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    fields: ImmutablePropTypes.list.isRequired,
    onChange: React.PropTypes.func.isRequired,
    value: ImmutablePropTypes.map
  },

  _getAvailableValues(fields) {
    const values = [];

    if (!this.getDefaultValue) {
      values.push({ key: 'null', value: null, text: '' })
    }

    return values.concat(this.getAvailableValues(fields).map(value => {
      return {
        ...value,
        key: getValueKey(value),
        text: value.title
      };
    }));
  },

  getInitialState() {
    return {
      availableValues: this._getAvailableValues(this.props.fields)
    }
  },

  onChange(item) {
    const returnValue = item
      ? Immutable.fromJS({ type: item.type, subType: item.subType, value: item.value })
      : null;

    this.props.onChange(returnValue);
  },

  onChangeSelect(item) {
    // const valueKey = e.target.value;
    // const selectedAvailableValue = _.find(this.state.availableValues, {key: valueKey});
    this.onChange(item);
  },

  componentWillReceiveProps({ fields }) {
    if (this.props.fields !== fields) {
      this.setState({
        availableValues: this._getAvailableValues(fields)
      });
    }
  },

  componentWillMount() {
    if (this.getDefaultValue) {
      const { value } = this.props;

      if (!value) {
        this.onChange(this.getDefaultValue());
      }
    }
  },

  render() {
    const { value } = this.props;
    const { availableValues } = this.state;

    const selectedValueKey = value && getValueKey(value.toJS());

    return (
      <Dropdown
        items={availableValues}
        multiselect={false}
        value={selectedValueKey}
        autocomplete={true}
        withButton={true}
        onSelectItems={([item]) => this.onChangeSelect(item)}
      />
    );
  }
});

export default BasicSelect;
