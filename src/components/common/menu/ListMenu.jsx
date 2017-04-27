import React from 'react'
import AbstractMenu from './AbstractMenu'
import style from './listmenu.less'

const ListMenu = ({ ...props }) => {
  /*return <AbstractMenu
    icon
    classMenu={style.horizontalMenu}
    classItem={style.menuItem}
    classSelected={style.selected}
    classItemVertical={style.classItemVertical}
    {...props}
  />*/
  return <AbstractMenu
    icon
    classMenu={style.horizontalMenu}
    classItem={style.menuItem}
    classSelected={style.selected}
    classItemVertical={style.classItemVertical}
    {...props}
  />
}

export default ListMenu;