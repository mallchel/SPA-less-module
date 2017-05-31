import React from 'react'
import classNames from 'classnames'

const RecordFiledHint = React.createClass({
  propTypes: {
    text: React.PropTypes.string,
    readOnly: React.PropTypes.bool.isRequired
  },

  render() {
    if (!this.props.text) {
      return null;
    }

    let classes = classNames(this.props.className, 'record-field__body__hint', {
      'record-field__body__hint--read-only': this.props.readOnly
    });

    return (
      <div className={classes}>{this.props.text}</div>
    );
  }

});

export default RecordFiledHint;
