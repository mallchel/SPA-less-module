import React, { Component } from 'react'
import OverlayDropdown from './OverlayDropdown'
import { Row, Icon } from 'antd'
import NavLink from '../../router/Link'
import { Link } from 'react-router-dom'
import cn from 'classnames'
import Dragula from 'react-dragula'

import styles from './abstractMenu.less'

class AbstractMenu extends Component {
  componentWillMount() {
    this.drake = Dragula(null, {
      moves: (el, source, handle, sibling) => console.log('moves', el, source, handle, sibling) || 1,
      accepts: (el, source, handle, sibling) => console.log('accepts', el, source, handle, sibling) || 1
    });
  }
  dragulaDecorator = (componentBackingInstance) => {
    if (componentBackingInstance) {
      this.drake.containers.push(componentBackingInstance);
      console.log(this.drake)
    }
  }

  render() {
    const {
      className,
      horizontal,
      vertical,
      items,
      route,
      params,
      draggable } = this.props;

    return (
      <Row type="flex" justify="space-between" align="middle" className={cn(className)}>
        <ul className={cn(horizontal.menu)} ref={draggable ? this.dragulaDecorator : null}>
          {
            items.map((item, i) => (
              <NavLink key={item.get('id')} route={item.get('route') || route} params={(params && { [params]: item.get('id') }) || {}} render={props => {
                return (
                  <li className={cn(horizontal.item, { [horizontal.selected]: props.isActive })}>
                    <Link to={props.link} className={cn(styles.link, horizontal.link)}>
                      {
                        item.get('icon') ? <Icon type={`icon ${item.get('icon')}`} className={cn(horizontal.icon)} /> : null
                      }
                      <div className={horizontal.text}>{item.get('name')}</div>
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
            vertical={vertical}
            container={this.dragulaDecorator}
          />
        </div>
      </Row>
    )
  }
}

/*const Menu = ({
  className,
  horizontal,
  vertical,
  items,
  route,
  params }) => {
  return (
    <Row type="flex" justify="space-between" align="middle" className={cn(className)}>
      <ul className={cn(horizontal.menu)}>
        {
          items.map((item, i) => (
            <NavLink key={item.get('id')} route={item.get('route') || route} params={(params && { [params]: item.get('id') }) || {}} render={props => {
              return (
                <li className={cn(horizontal.item, { [horizontal.selected]: props.isActive })}>
                  <Link to={props.link} className={cn(styles.link, horizontal.link)}>
                    {
                      item.get('icon') ? <Icon type={`icon ${item.get('icon')}`} className={cn(horizontal.icon)} /> : null
                    }
                    <div className={horizontal.text}>{item.get('name')}</div>
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
          vertical={vertical}
        />
      </div>
    </Row>
  )
}*/

// export default Menu;

export default AbstractMenu;
