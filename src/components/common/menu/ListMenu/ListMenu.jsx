import React from 'react'
import AbstractMenu from '../AbstractMenu'
import styles from './listmenu.less'

const ListMenu = ({ ...props }) => {
  return <AbstractMenu
    classMenu={styles.horizontalMenu}
    classItem={styles.menuItem}
    classSelected={styles.selected}
    classItemVertical={styles.menuItemVertical}
    classLink={styles.link}
    classIcon={styles.icon}
    classText={styles.text}
    classLinkVertical={styles.linkVertical}
    {...props}
  />
}

export default ListMenu;
