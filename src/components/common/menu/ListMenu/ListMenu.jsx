import React from 'react'
import AbstractMenu from '../AbstractMenu'
import horizontal from './horizontal.less'
import vertical from './vertical.less'

const ListMenu = ({ ...props }) => {
  return <AbstractMenu
    horizontal={horizontal}
    vertical={vertical}
    {...props}
  />
}

export default ListMenu;
