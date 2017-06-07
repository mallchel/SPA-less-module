import React from 'react'
import NavLink from '../../../router/Link'
import { Link } from 'react-router-dom'
import { Icon } from 'antd'
import cn from 'classnames'
import _ from 'lodash'
import { dragSource, dropTarget } from '../dndSourceTarget'

import styles from './OverlayDropdown.less'

function Item({ item, vertical, connectDragSource, connectDragPreview, connectDropTarget, route, params }) {
  return (
    <NavLink route={item.get('route') || route} params={{ [params]: item.get('id') }} render={props => {
      return _.flow(connectDragSource, connectDragPreview, connectDropTarget)(
        <li className={cn(vertical.item, { [vertical.selected]: props.isActive })}>
          <Link to={props.link} className={cn(styles.link, vertical.link)}>
            {
              item.get('icon') ? <Icon type={`icon ${item.get('icon')}`} className={cn(vertical.icon)} /> : null
            }
            <div className={vertical.text}>{item.get('name')}</div>
          </Link>
        </li>
      )
    }} />
  )
}

export default _.flow(dragSource, dropTarget)(Item);
