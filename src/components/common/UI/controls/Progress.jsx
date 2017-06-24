import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import ReactDOM from 'react-dom'
import $ from 'jquery'
import styles from './controls.less'

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
    // $('body').addClass('crm-user-select-none');
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
    // $('body').removeClass('crm-user-select-none');
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
      let val = this.getPercents(parseInt(nextProps.value, 10)) || 0;
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
      <div className={styles.progressContainer}>
        <div className={styles.progressText}>{val}</div>
        <div ref="bar" className={styles.progressBar} onMouseDown={this.onMouseDown} >
          <div className={styles.progressSlider} style={{ width: val }} />
          <div className={styles.progressDivider} />
          <div className={styles.progressDivider} />
          <div className={styles.progressDivider} />
          <div className={styles.progressDivider} />
          <div className={styles.progressDivider} />
          <div className={styles.progressDivider} />
          <div className={styles.progressDivider} />
          <div className={styles.progressDivider} />
          <div className={styles.progressDivider} />
        </div>
      </div>
    );
  }
});

export default ProgressField;
