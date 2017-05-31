import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import ReactDOM from 'react-dom'
import $ from 'jquery'

const ProgressField = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    value: React.PropTypes.number,
    config: React.PropTypes.object,
    onSave: React.PropTypes.func.isRequired,
    onUpdate: React.PropTypes.func.isRequired,
    readOnly: React.PropTypes.bool
  },

  getInitialState() {
    let val = this.getPercents(this.props.value) || 0;

    return {
      isActive: false,
      value: val,
      savedValue: val
    };
  },

  getPercents(val) {
    return Math.round(val)
  },

  onMouseDown(e) {
    if (this.props.readOnly) {
      return;
    }

    this.setState({
      isActive: true
    });
    $('body').addClass('crm-user-select-none');
    $('body').on('mousemove', this.onMouseMove);
    $('body').on('mouseup', this.onMouseUp);
    this.onMouseMove(e);
  },

  onMouseMove(e) {
    let el = $(ReactDOM.findDOMNode(this.refs.bar));
    let left = el.offset().left;
    let width = el.width();
    let pos = e.clientX - left;
    let preValue = (Math.min(width, Math.max(0, pos)) / width) * 100;

    this.setState({
      value: this.getPercents(preValue)
    });
  },

  onMouseUp(e) {
    $('body').removeClass('crm-user-select-none');
    $('body').off('mousemove', this.onMouseMove);
    $('body').off('mouseup', this.onMouseUp);
    this.setState({
      isActive: false
    });
    if (this.state.value !== this.state.savedValue) {
      this.props.onSave(this.state.value);
      this.props.onUpdate(this.state.value);
    }
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      let val = this.getPercents(parseInt(nextProps.value)) || 0;
      this.setState({
        value: val,
        savedValue: val
      });
    }
  },

  componentWillUnmount() {
    $('body').off('mousemove', this.onMouseMove);
    $('body').off('mouseup', this.onMouseUp);
  },

  render() {
    let val = Math.round(this.state.value) + '%';
    return (
      <div className="record-progress">
        <div className="record-progress__value">{val}</div>
        <div ref="bar" className="record-progress__bar" onMouseDown={this.onMouseDown} >
          <div className="record-progress__slider" style={{ width: val }} />
          <div className="record-progress__divider" />
          <div className="record-progress__divider" />
          <div className="record-progress__divider" />
          <div className="record-progress__divider" />
          <div className="record-progress__divider" />
          <div className="record-progress__divider" />
          <div className="record-progress__divider" />
          <div className="record-progress__divider" />
          <div className="record-progress__divider" />
        </div>
      </div>
    );
  }
});

export default ProgressField;
