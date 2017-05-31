import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import DropdownButton from './DropdownButton';

const DropdownButtonOnlyItems = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    items: React.PropTypes.arrayOf(React.PropTypes.shape({
      text: React.PropTypes.string.isRequired,
      onClick: React.PropTypes.func,
      type: React.PropTypes.string
    })).isRequired,
    disabled: React.PropTypes.bool
  },

  render() {
    let firstItem = this.props.items[0];

    if (!firstItem) {
      return null;
    }

    return (
      <DropdownButton
      items={this.props.items.slice(1)}
      disabled={firstItem.disabled || this.props.disabled}
      text={firstItem.text}
      type={firstItem.type}
      onClick={firstItem.onClick}/>
    )
  }
});

export default DropdownButtonOnlyItems;
