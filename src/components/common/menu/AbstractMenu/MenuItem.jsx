import React, { Component } from 'react'
import { Icon } from 'antd'
import { Link } from 'react-router-dom'
import _ from 'lodash'
import cn from 'classnames'
import PropTypes from 'prop-types'
import NavLink from '../../router/Link'
import { dragSource, dropTarget } from './dndSourceTarget'

import styles from './abstractMenu.less'

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
    const { connectDragSource, connectDragPreview, connectDropTarget, isDragging, item, horizontal, route, params } = this.props;
    return (
      <NavLink route={item.get('route') || route} params={(params && { [params]: item.get('id') }) || {}} render={props => {
        return _.flow(connectDragSource, connectDragPreview, connectDropTarget)(
          <li
            className={cn(horizontal.item, { [horizontal.selected]: props.isActive }, { 'dragging': isDragging })}
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
            style={isDragging ? { opacity: '0.1' } : null}
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
