import React from 'react'
import OverlayDropdown from './OverlayVisible'
import { Row, Icon } from 'antd'
import NavLink from '../router/Link'
import { Link } from 'react-router-dom'

const Menu = ({ classMenu, classItem, classSelected, items, route, params, icon, className, ...props }) => {
  return (
    <Row type="flex" justify="space-between" align="middle">
      <ul className={className ? `${classMenu} ${className}` : classMenu}>
        {
          items.map(item => (
            <NavLink key={item.id} route={route} params={{ [params]: item.id }} component={(props) => {
              return (
                <li className={props.isActive ? `${classItem} ${classSelected}` : classItem}>
                  <Link to={props.link}>
                    {
                      icon ? <Icon type={item.icon} /> : null
                    }
                    {item.name}</Link>
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
          classItem={classItem}
          classSelected={classSelected}
          icon={icon}
          {...props}
        />
      </div>
    </Row>
  )
}

export default Menu;
