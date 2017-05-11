import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import classNames from 'classnames';

const log = require('debug')('CRM:Component:Record:TabItem');

const RecordTabItem = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    tabId: React.PropTypes.string.isRequired,
    onClickItem: React.PropTypes.func.isRequired,
    selected: React.PropTypes.bool.isRequired,
    disabled: React.PropTypes.bool
  },

  onClick() {
    if ( this.props.disabled ) {
      return;
    }
    this.props.onClickItem(this.props.tabId);
  },

  render() {
    let classes = classNames({
      'tabs__item': true,
      'tabs__item--active': this.props.selected,
      'tabs__item--disabled': this.props.disabled
    }, 'tabs__item--'+this.props.tabId);

    return (
      <li onClick={this.onClick} className={classes}>
        {this.props.children}
      </li>
    );
  }

});

export default RecordTabItem;
