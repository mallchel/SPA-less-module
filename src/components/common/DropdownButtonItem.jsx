import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import classNames from 'classnames';

const DropdownButtonItem = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    text: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func.isRequired,
    icon: React.PropTypes.string,
    isFirst: React.PropTypes.bool,
    isLast: React.PropTypes.bool,
    disabled: React.PropTypes.bool
  },
  onClick() {
    if ( this.props.disabled ) {
      return;
    }
    this.props.onClick();
  },
  render() {
    let classes = classNames({
      'button-action-list__item': true,
      'button-action-list__item--first': this.props.isFirst,
      'button-action-list__item--last': this.props.isLast,
      'button-action-list__item--disabled': this.props.disabled
    });

    return (
      <li className={classes} onClick={this.onClick}>
        { this.props.icon ? <i className={'icon icon--' + this.props.icon}></i> : null }
        <span>{this.props.text}</span>
      </li>
    );
  }

});

export default DropdownButtonItem;
