import React, { Component } from 'react'
import { Icon } from 'antd'
import { Link } from 'react-router-dom'
import { DragSource, DropTarget } from 'react-dnd'
import _ from 'lodash'
import cn from 'classnames'
import PropTypes from 'prop-types'
import NavLink from '../../router/Link'
import dndTargets from '../../../../configs/dndTargets'
import dragAndDropActions from '../../../../actions/dragAndDropActions'

import styles from './abstractMenu.less'

const dragSource = DragSource(dndTargets.SIDEBAR_ITEM, {
  beginDrag(props) {
    console.log(111)
    let item = { id: props.item.get('id') };
    dragAndDropActions.beginDrag(dndTargets.SIDEBAR_ITEM, item);
    return item;
  },
  endDrag(props) {
    console.log(222)
    dragAndDropActions.endDrag();
    props.onDragEnd(props.item.get('id'));
  },
  canDrag(props) {
    return props.canDrag;
  }
}, function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  }
});

const dropTarget = DropTarget(dndTargets.SIDEBAR_ITEM, {
  hover(props, monitor) {
    const item = monitor.getItem();
    props.onMoveItem(item.id, props.item.get('id'));
  }
}, function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget()
  };
});

class MenuItem extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    onDragEnd: PropTypes.func.isRequired
  }

  state = {
    iconHovered: false
  }

  onMouseEnter = (e) => {
    this.setState({
      iconHovered: true
    });
  }

  onMouseLeave = (e) => {
    this.setState({
      iconHovered: false
    });
  }

  render() {
    const { connectDragSource, connectDragPreview, connectDropTarget, isDragging, canDrag, item, horizontal, route, params } = this.props;

    return (
      <NavLink route={item.get('route') || route} params={(params && { [params]: item.get('id') }) || {}} render={props => {
        return _.flow(connectDragSource, connectDragPreview, connectDropTarget)(
          <li
            className={cn(horizontal.item, { [horizontal.selected]: props.isActive }, canDrag, { 'dragging': isDragging })}
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
          >
            <Link to={props.link} className={cn(styles.link, horizontal.link)}>
              {
                item.get('icon') ? <Icon type={`icon ${item.get('icon')}`} className={cn(horizontal.icon)} /> : null
              }
              <div className={horizontal.text}>{item.get('name')}</div>
            </Link>
          </li>
        )
      }} />
    )

  }
}

export default _.flow(dragSource, dropTarget)(MenuItem);
