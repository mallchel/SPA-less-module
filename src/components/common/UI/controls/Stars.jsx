import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import cn from 'classnames'
import _ from 'lodash'
import PropTypes from 'prop-types'
import { Icon } from 'antd'

import styles from './controls.less'

const Stars = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    value: PropTypes.number,
    config: PropTypes.object,
    onSave: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    readOnly: PropTypes.bool
  },

  getInitialState() {
    return {
      value: this.props.value
    };
  },

  onClickStar(value) {
    if (this.props.readOnly) {
      return;
    }

    if (value === 1 && this.state.value === 1) {
      value = 0;
    }
    this.setState({
      value: value
    });

    this.props.onSave(value);
    this.props.onUpdate(value);
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({
        value: nextProps.value
      });
    }
  },

  render() {
    var stars = [];

    for (var i = 0; i < 5; i++) {
      stars.push(
        <Icon
          key={i}
          type="icon vote-38"
          className={cn(styles.starsField, {
            [styles.starsFieldSelected]: i < this.state.value,
            [styles.nonReadOnly]: !this.props.readOnly
          })}
          onClick={_.bind(this.onClickStar, this, i + 1)}
        />
      );
    }

    return (
      <div className={styles.starsContainer}>
        {stars}
      </div>
    );
  }
});

export default Stars;
