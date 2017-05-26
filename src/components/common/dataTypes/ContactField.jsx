import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ImmutablePropTypes from 'react-immutable-proptypes';

const CheckboxesField = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    value: ImmutablePropTypes.list,
    config: ImmutablePropTypes.contains({
      type: React.PropTypes.string
    }).isRequired
  },

  render() {
    let value = this.props.value || [];

    let contacts = value.map(item=> item.get('contact')).filter(val=> val);

    return (
      <span>{contacts.join(', ')}</span>
    );
  }
});

export default CheckboxesField;
