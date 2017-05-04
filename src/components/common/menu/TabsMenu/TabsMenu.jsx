import React from 'react'
import AbstractMenu from '../AbstractMenu'
import styles from './tabsMenu.less'

const TabsMenu = ({ ...props }) => {
  return <AbstractMenu
    horizontal={{
      menu: `ant-menu ant-menu-horizontal ${styles.menu}`,
      item: 'ant-menu-item',
      selected: 'ant-menu-item-selected',
      text: styles.text
    }}
    vertical={{
      menu: 'ant-menu-inline',
      item: 'ant-menu-item',
      selected: 'ant-menu-item-selected',
      text: styles.text
    }}
    {...props } />;
}

export default TabsMenu;
