import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import classNames from 'classnames'
import _ from 'lodash'

const StarsField = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    value: React.PropTypes.number,
    config: React.PropTypes.object,
    onSave: React.PropTypes.func.isRequired,
    onUpdate: React.PropTypes.func.isRequired,
    readOnly: React.PropTypes.bool
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
    if (this.props.value != nextProps.value) {
      this.setState({
        value: nextProps.value
      });
    }
  },

  render() {

    var stars = [];

    for (var i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className="icon icon--vote-38" onClick={_.bind(this.onClickStar, this, i + 1)} />
      );
    }

    let classes = classNames('record-stars stars-field stars-field--' + this.state.value, {
      'stars-field--hand': !this.props.readOnly
    });

    return (
      <span className={classes}>
        {stars}
      </span>
    );
  }
});

export default StarsField;
