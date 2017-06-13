import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import ReactDOM from 'react-dom'
import $ from 'jquery'
import cn from 'classnames'
import { Icon } from 'antd'
import DROPDOWN_COLORS, { Labels as DROPDOWN_COLORS_LABELS } from '../../../configs/dropdownColors'

import styles from './fields.less'

const ItemListEditorColor = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    color: React.PropTypes.string,
    label: React.PropTypes.string,
    selected: React.PropTypes.bool.isRequired,
    onSelect: React.PropTypes.func.isRequired,
    disabled: React.PropTypes.bool
  },

  select() {
    this.props.onSelect(this.props.color);
  },

  render() {
    return (
      <div onClick={this.select}
        title={this.props.label}
        style={{ backgroundColor: '#' + this.props.color }}
        className={styles.itemColor}>
        {this.props.selected ? <div /> : null}
      </div>
    );
  }
});


const ItemListEditorColorPicker = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    currentColor: React.PropTypes.string,
    onSelect: React.PropTypes.func.isRequired
  },

  getInitialState: function () {
    return {
      isOpen: false
    };
  },

  onSelectColor(color) {
    this.setState({
      isOpen: false
    });
    this.props.onSelect(color);
  },

  onClickArrow() {
    if (this.props.disabled) {
      return;
    }
    const isOpen = this.state.isOpen;
    this.setState({
      isOpen: !isOpen
    });
  },

  closeList(e) {
    let el = $(e.target),
      arrow = ReactDOM.findDOMNode(this.refs.arrow),
      list = ReactDOM.findDOMNode(this.refs.list);

    if (e.target !== list && el.parents('.items-list__color-list').toArray().indexOf(list) === -1 &&
      e.target !== arrow && el.parents('.items-list__color-picker-arrow').toArray().indexOf(arrow) === -1) {
      this.setState({
        isOpen: false
      });
    }
  },

  closeListEsc(e) {
    if (e.keyCode === 27) {
      this.setState({
        isOpen: false
      });
    }
  },

  componentDidUpdate: function (prevProps, prevState) {
    if (this.state.isOpen && !prevState.isOpen) {
      $('body').on('click', this.closeList);
      $('body').on('keydown', this.closeListEsc);
    } else if (!this.state.isOpen && prevState.isOpen) {
      $('body').off('click', this.closeList);
      $('body').off('keydown', this.closeListEsc);
    }
  },

  componentWillUnmount: function () {
    $('body').off('click', this.closeList);
    $('body').off('keydown', this.closeListEsc);
  },

  render() {
    let colors = DROPDOWN_COLORS.map((color, i) =>
      <ItemListEditorColor
        key={color} selected={color === this.props.currentColor}
        label={DROPDOWN_COLORS_LABELS[i]}
        color={color} onSelect={this.onSelectColor} />);

    return (
      <div className={styles.colorPicker}>
        <div className={styles.colorPickerArrow} ref="arrow" onClick={this.onClickArrow}>
          <Icon className={this.state.isOpen ? 'fa-rotate-180' : null} type='icon arrows-chevron-medium-fat-4-01' />
        </div>
        <div ref="list" className={styles.colorList} style={this.state.isOpen ? null : { display: 'none' }} title="">
          {colors}
        </div>
      </div>
    );
  }
});

export default ItemListEditorColorPicker;
