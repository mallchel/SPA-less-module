import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

const RadiobuttonField = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    value: React.PropTypes.string.isRequired,
    config: React.PropTypes.object
  },

  render() {
    return (
      <span>{this.props.value}</span>
    );
  }
});

export default RadiobuttonField;
