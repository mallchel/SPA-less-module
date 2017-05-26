import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

const CheckboxesField = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    value: React.PropTypes.object.isRequired,
    config: React.PropTypes.object
  },

  render() {
    return (
      <span>{this.props.value}</span>
    );
  }
});

export default CheckboxesField;
