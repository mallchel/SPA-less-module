import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

const IndexField = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    index: React.PropTypes.number.isRequired
  },

  render() {
    return (
      <span>{this.props.index}</span>
    );
  }
});

export default IndexField;
