import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

const TextField = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    value: React.PropTypes.string,
    config: React.PropTypes.object,
  },

  render() {
    let val = this.props.value;

    // WTF: {val || ' '} ???
    return (
      <span>{val || ' '}</span>
    );
  }
});

export default TextField;
