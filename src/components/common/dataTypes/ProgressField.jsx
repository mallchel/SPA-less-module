import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

const ProgressField = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    value: React.PropTypes.number,
    config: React.PropTypes.object
  },

  render() {
    if ( this.props.value == null ) {
      return <span>&nbsp;</span>;
    } else {
      return (
        <span>{Math.round(this.props.value) + '%'}</span>
      );
    }
  }
});

export default ProgressField;
