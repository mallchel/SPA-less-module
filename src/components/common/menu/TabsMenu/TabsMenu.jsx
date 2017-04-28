import React from 'react'
import AbstractMenu from '../AbstractMenu'
import style from './tabsMenu.less'

const TabsMenu = ({ ...props }) => {
  return <AbstractMenu
    classMenu={`ant-menu ant-menu-horizontal ${style.horizontalMenu}`}
    classItem='ant-menu-item'
    classSelected='ant-menu-item-selected'
    classMenuVertival='ant-menu-inline'
    classItemVertical='ant-menu-item'
    {...props} />;
}

export default TabsMenu;
