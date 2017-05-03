import React from 'react'
import AbstractMenu from '../AbstractMenu'
import styles from './tabsMenu.less'

const TabsMenu = ({ ...props }) => {
  return <AbstractMenu
    classMenu={`ant-menu ant-menu-horizontal ${styles.horizontalMenu}`}
    classItem='ant-menu-item'
    classSelected='ant-menu-item-selected'
    classMenuVertival='ant-menu-inline'
    classItemVertical='ant-menu-item'
    classText={styles.text}
    {...props} />;
}

export default TabsMenu;
