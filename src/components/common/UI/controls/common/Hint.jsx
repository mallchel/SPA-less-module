import React from 'react'
import cn from 'classnames'

import styles from '../controls.less'

const RecordFiledHint = React.createClass({
  propTypes: {
    text: React.PropTypes.string,
    readOnly: React.PropTypes.bool.isRequired
  },

  render() {
    if (!this.props.text) {
      return null;
    }

    let classes = cn(this.props.className, styles.hint);

    return (
      <div className={classes}>{this.props.text}</div>
    );
  }

});

export default RecordFiledHint;
