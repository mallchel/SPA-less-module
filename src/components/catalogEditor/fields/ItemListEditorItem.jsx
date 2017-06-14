import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import classNames from 'classnames'
import { DragSource, DropTarget } from 'react-dnd'
import _ from 'lodash'
import { Input, Icon } from 'antd'

import dndTargets from '../../../configs/dndTargets'
import dragAndDropActions from '../../../actions/dragAndDropActions'
import ItemListEditorColorPicker from './ItemListEditorColorPicker'
import { confirm } from '../../common/Modal'
import trs from '../../../getTranslations'
import ButtonTransparent from '../../common/elements/ButtonTransparent'

import styles from './fields.less'

const log = require('debug')('CRM:Component:ItemListEditorItem');

const dragSource = DragSource(dndTargets.DROPDOWN_ITEM, {
  beginDrag(props) {
    let item = {
      id: props.itemId,
      index: props.itemIndex,
      name: props.name
    };
    log('beginDrag', item.index);
    dragAndDropActions.beginDrag(dndTargets.DROPDOWN_ITEM, item);
    return item;
  },
  endDrag(props) {
    dragAndDropActions.endDrag();
    props.onDragEnd();
  }
}, function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  }
});

const dropTarget = DropTarget(dndTargets.DROPDOWN_ITEM, {
  hover(props, monitor) {
    const item = monitor.getItem();
    props.moveItem(item.name, props.name);
  }
}, function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget()
  };
});

const ItemListEditorItem = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    itemId: React.PropTypes.string,
    itemIndex: React.PropTypes.number.isRequired,
    name: React.PropTypes.string.isRequired,
    color: React.PropTypes.string,
    withColor: React.PropTypes.bool,
    onChangeColor: React.PropTypes.func,
    onChangeName: React.PropTypes.func,
    onRemove: React.PropTypes.func.isRequired,
    onDragEnd: React.PropTypes.func.isRequired,
    moveItem: React.PropTypes.func.isRequired,
    disabled: React.PropTypes.bool
  },
  getInitialState: function () {
    return {
      iconHovered: false,
      value: this.props.name
    };
  },

  onSelectColor(color) {
    this.props.onChangeColor(this.props.itemIndex, color);
  },

  onClickRemove() {
    if (this.props.itemId) {
      confirm({
        headerText: trs('modals.removeDropdownItemConfirm.header'),
        text: trs('modals.removeDropdownItemConfirm.text'),
        okText: trs('modals.removeDropdownItemConfirm.okText'),
        cancelText: trs('modals.removeDropdownItemConfirm.cancelText'),
        onOk: () => {
          this.props.onRemove(this.props.itemIndex)
        }
      })
    } else {
      this.props.onRemove(this.props.itemIndex);
    }
  },

  onMouseEnterIcon() {
    this.setState({
      iconHovered: true
    });
  },

  onMouseLeaveIcon() {
    this.setState({
      iconHovered: false
    });
  },

  onChangeName(e) {
    let val = e.target.value;
    this.setState({ value: val });
  },

  onBlur(e) {
    if (typeof this.props.onChangeName === 'function') {
      this.props.onChangeName(this.props.itemIndex, e.target.value);
    }
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.name
    });
  },

  render() {
    const { connectDragSource, connectDragPreview, connectDropTarget, isDragging } = this.props;

    let classes = classNames({
      [styles.list]: true,
      'dragging': isDragging,
      'items-list__item--colors': this.props.withColor
    });

    return _.flow(connectDragPreview, connectDropTarget)(
      <div className={classes}
        style={{ backgroundColor: '#' + this.props.color }}
        title={this.props.name}>
        {connectDragSource(
          <div className="anticon-icon interface-30" onMouseEnter={this.onMouseEnterIcon}
            onMouseLeave={this.onMouseLeaveIcon}></div>
        )}
        <Input
          disabled={this.props.disabled}
          type="text"
          value={this.state.value}
          ref="nameInput"
          onBlur={this.onBlur}
          onChange={this.onChangeName}
          className={styles.inputTags}
        />
        {this.props.withColor && !this.props.disabled ?
          <ItemListEditorColorPicker
            disabled={this.props.disabled}
            onSelect={this.onSelectColor}
            currentColor={this.props.color} /> :
          null
        }
        {!this.props.disabled ?
          <ButtonTransparent onClick={this.onClickRemove}>
            <Icon type='icon interface-74'></Icon>
          </ButtonTransparent> :
          null
        }
      </div>
    );
  }
});

export default _.flow(dropTarget, dragSource)(ItemListEditorItem);
