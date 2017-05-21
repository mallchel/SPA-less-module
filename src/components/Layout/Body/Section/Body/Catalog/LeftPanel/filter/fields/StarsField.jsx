import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import debug from 'debug'
import _ from 'lodash'

const log = debug('CRM:filters:StarsField')

const StarsField = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    value: React.PropTypes.object,
    config: React.PropTypes.object,
    onSave: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      value: (this.props.value && this.props.value.toJS()) || []
    };
  },

  onClickStar(newVal) {
    //
    let value = this.state.value;
    if (value.indexOf(newVal) == -1) {
      value.push(newVal);
    } else {
      _.remove(value, (i) => i == newVal);
    }

    log('new values', value);

    this.setState({
      value: value
    }, () => {
      setTimeout(()=>{
        this.onSave(value);
      }, 0);
    });
  },

  onSave(value) {
    this.props.onSave(this.props.fieldId, value);
  },

  render() {
    var stars = [];

    for (var i = 1; i <= 5; i++) {
      stars.push(
        <span key={i}
              className={"icon icon--vote-38 " + (this.state.value.indexOf(i) != -1 ? 'active' : '') }
              onClick={_.bind(this.onClickStar, this, i)} />
      );
    }

    return (
      <span className={'record-stars stars-field stars-field'}>
        {stars}
      </span>
    );
  }
});

export default StarsField;
