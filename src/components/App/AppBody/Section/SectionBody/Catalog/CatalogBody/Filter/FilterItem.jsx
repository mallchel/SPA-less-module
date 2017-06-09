import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { EventEmitter } from 'events'
import PropTypes from 'prop-types'
import { Icon } from 'antd'
import ButtonTransparent from '../../../../../../../common/elements/ButtonTransparent'

import styles from './filter.less'

const FilterItem = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    opened: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    onDrop: PropTypes.func.isRequired,
    eventHub: PropTypes.objectOf(EventEmitter)
  },

  getInitialState() {
    return {
      opened: this.props.opened
    }
  },

  onHeaderClick() {
    this.setState({ opened: true });

    // event hub
    setTimeout(() => this.props.eventHub.emit('open'), 0);
  },

  onClickClose() {
    this.setState({
      opened: false
    });
    this.props.onDrop();
  },

  componentWillReceiveProps(nextProps) {
    // shouldn't hide filter item.
    if (nextProps.value !== this.props.value) {
      this.setState({ opened: nextProps.opened });
    }
  },

  render() {
    let name = this.props.name;
    let header = <div className={styles.itemHeader} onClick={this.onHeaderClick} title={name}>
      <span className={styles.itemFieldName}>{name}</span>
    </div>;

    let control = <div>
      <div className={styles.controlHeader}>
        <label className={styles.controlLabel} onClick={this.onClickClose} title={name}>{name}</label>
        <ButtonTransparent
          className={styles.controlClose}
          onClick={this.onClickClose}
        >
        <Icon className={styles.controlCloseIcon} type="icon interface-74" />
        </ButtonTransparent>
      </div>

      <div className={styles.controlBody}>
        {this.props.children}
      </div>
    </div>;

    return (
      <div className={styles.item}>
        {!this.state.opened ? header : control}
      </div>
    );
  }

});

export default FilterItem;
