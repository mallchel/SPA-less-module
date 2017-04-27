import React from 'react'
import AbstractMenu from '../AbstractMenu'
import styles from './listmenu.less'

const ListMenu = ({ ...props }) => {
  /*return <AbstractMenu
    icon
    classMenu={styles.horizontalMenu}
    classItem={styles.menuItem}
    classSelected={styles.selected}
    classItemVertical={styles.menuItemVertical}
    {...props}
  />*/
  return <AbstractMenu
    icon
    classMenu={styles.horizontalMenu}
    classItem={styles.menuItem}
    classSelected={styles.selected}
    classItemVertical={styles.menuItemVertical}
    {...props}
  />
}

export default ListMenu;