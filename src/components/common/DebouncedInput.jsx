import React from 'react'
import ReactDOM from 'react-dom'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import _ from 'lodash'
import classnames from 'classnames'
import { Input } from 'antd'
import PropTypes from 'prop-types'

import KEYS from '../../configs/keys'
import InputFocusMixin from '../mixins/InputFocusMixin'

const log = require('debug')('CRM:Component:Record:DebouncedInput');

const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1;
const MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER || -MAX_SAFE_INTEGER;

const DebouncedInput = React.createClass({
  mixins: [
    PureRenderMixin,
    InputFocusMixin(function () {
      return this.refs.input ? ReactDOM.findDOMNode(this.refs.input) : ReactDOM.findDOMNode(this.refs.textArea)
    })
  ],
  propTypes: {
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    type: PropTypes.string,
    onSave: PropTypes.func.isRequired,
    onKeyDown: PropTypes.func,
    wrapperClassName: PropTypes.string,
    className: PropTypes.string,
    multiline: PropTypes.bool,
    disableDebounce: PropTypes.bool,
    readOnly: PropTypes.bool,
    error: PropTypes.string
  },

  getInitialState() {
    return {
      value: this.props.value,
      lastSavedValue: this.props.value
    };
  },

  save(value = this.state.value) {
    clearTimeout(this._saveTimer);
    if (value !== this.props.value || value !== this.state.lastSavedValue) {
      log('save', value);
      this.props.onSave(value);
      this.setState({
        lastSavedValue: value
      });
    }
  },

  debouncedSave(val) {
    clearTimeout(this._saveTimer);

    if (this.props.disableDebounce) {
      this.save(val);
    } else {
      this._saveTimer = setTimeout(() => {
        this.save();
      }, 200);
    }
  },

  onChange(e) {
    let val = e.target.value;

    if (this.props.type === 'number') {
      if (val !== '') {
        val = val.replace(/,/g, '.');
        if (isNaN(Number(val)) || !_.inRange(Number(val), MIN_SAFE_INTEGER, MAX_SAFE_INTEGER)) {
          this.setState({
            value: val
          });
          return;
        }
      }
    }
    log('set val', val);
    this.setState({
      value: val
    });

    this.debouncedSave(val);
  },

  onBlur(e) {
    this.save();
    this.props.onBlur && this.props.onBlur(e);
  },

  onKeyDown(e) {
    if (this.props.onKeyDown) {
      this.props.onKeyDown(e);
    }
    if (e.keyCode === KEYS.ENTER) {
      e.target.blur();
    }
  },

  onKeyDownMultiline(e) {
    if (this.props.onKeyDown) {
      this.props.onKeyDown(e);
    }
  },

  componentWillUnmount() {
    // this.save();
    clearTimeout(this._saveTimer);
  },

  componentDidMount() {
    if (this.refs.textArea) {
      this.resize();
    }
  },

  componentDidUpdate() {
    if (this.refs.textArea) {
      this.resize();
    }
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value && this.state.value === this.state.lastSavedValue) {
      let newValue = nextProps.value;
      if (this.props.type === 'number') {
        if (!nextProps.value && !_.isNull(nextProps.value)) {
          newValue = 0;
        }
      }
      this.setState({
        value: newValue,
        lastSavedValue: newValue
      });
    }
  },
  resize() {
    let textareaDomNode = ReactDOM.findDOMNode(this.refs.textArea);
    let textAreaWrapperDomNode = ReactDOM.findDOMNode(this.refs.textAreaWrapper);
    this.setOverfow('scroll');
    if (textareaDomNode.scrollHeight > 500 && textareaDomNode.style.height == 500) {
      return;
    }
    // let rows = textareaDomNode.rows || 1;
    // console.log(textareaDomNode.rows)
    // textareaDomNode.style.height = '1px';
    // let height = textareaDomNode.scrollHeight;
    // height = Math.min(500, height);
    // height = Math.max((rows * 20 + 6), height);
    // textAreaWrapperDomNode.style.height = height + 'px';
    // textareaDomNode.style.height = height + 'px';
    // console.log(height, 'px')
    // if (textareaDomNode.scrollHeight <= 500) {
    //   this.setOverfow('hidden');
    // }
  },
  setOverfow(overflow) {
    //Задание overflow с насильным redraw для Chrome/Safari
    let textareaDomNode = ReactDOM.findDOMNode(this.refs.textArea);
    const width = textareaDomNode.style.width;
    textareaDomNode.style.width = '0px';
    textareaDomNode.style.width = width;
    textareaDomNode.style.overflowY = overflow;
  },
  render() {
    let props = {
      ...this.props,
      className: classnames(this.props.className), //'debounced-input', {
      // 'debounced-input--empty': _.isNull(this.state.value),
      // 'debounced-input--number': (this.props.type == 'number'),
      // 'debounced-input--inline': !this.props.multiline
      // }),
      value: this.state.value,
      onBlur: this.onBlur,
      onChange: this.onChange,
      onKeyDown: this.props.multiline ? this.onKeyDownMultiline : this.onKeyDown,
      readOnly: this.props.readOnly
    };

    let wrapperClassName = 'textarea--wrapper ' + (this.props.wrapperClassName || '');
    if (props.style) {
      props.style.resize = 'none'
    }

    return this.props.multiline ?
      (
        <div ref="textAreaWrapper" className={wrapperClassName}>
          <Input
            ref="textArea"
            type="textarea"
            {...props}
            autosize
          />
        </div>
      )
      :
      <Input ref="input" {...props} />
  }
});

export default DebouncedInput;
