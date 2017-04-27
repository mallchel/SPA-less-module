import React from 'react'
import AbstractMenu from './AbstractMenu'
import style from './tabsmenu.less'

const TabsMenu = ({ ...props }) => {
  return <AbstractMenu classMenu={`ant-menu ant-menu-horizontal ${style.horizontalMenu}`} classItem=' ant-menu-item ' classSelected=' ant-menu-item-selected ' {...props} />;
}

export default TabsMenu;
