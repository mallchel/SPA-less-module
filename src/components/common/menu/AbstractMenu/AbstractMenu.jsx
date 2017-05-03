import React from 'react'
import OverlayDropdown from '../OverlayVisible'
import { Row, Icon } from 'antd'
import NavLink from '../../router/Link'
import { Link } from 'react-router-dom'
import cn from 'classnames'
import styles from './abstractMenu.less'

const Menu = ({
  classMenu,
  classItem,
  classSelected,
  items,
  route,
  params,
  className,
  classIcon,
  classLink,
  classItemVertical,
  classMenuVertival,
  classLinkVertical,
  classText }) => {
  return (
    <Row type="flex" justify="space-between" align="middle">
      <ul className={className ? `${classMenu} ${className}` : classMenu}>
        {
          items.map(item => (
            <NavLink key={item.id} route={route} params={{ [params]: item.id }} component={props => {
              return (
                <li className={cn(classItem, { [classSelected]: props.isActive })}>
                  <Link to={props.link} className={cn(styles.link, classLink)}>
                    {
                      item.icon ? <Icon type={item.icon} className={cn(classIcon)} /> : null
                    }
                    <span className={classText}>{item.name}</span>
                  </Link>
                </li>
              )
            }} />
          ))
        }
      </ul>
      <div>
        <OverlayDropdown
          items={items}
          route={route}
          params={params}
          classSelected={classSelected}
          classItemVertical={classItemVertical}
          classMenuVertival={classMenuVertival}
          classLinkVertical={classLinkVertical}
          classIcon={classIcon}
          classText={classText}
        />
      </div>
    </Row>
  )
}

export default Menu;
