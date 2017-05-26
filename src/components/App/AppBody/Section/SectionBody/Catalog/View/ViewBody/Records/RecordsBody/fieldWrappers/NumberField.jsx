import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import BaseNumberField from '../../../../../../../../../../common/dataTypes/NumberField'

const NumberField = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    config: React.PropTypes.object.isRequired
  },

  render() {
    return (
      <BaseNumberField value={this.props.value} config={this.props.config} withUnit={true} />
    );
  }
});

export default NumberField;
