import React from 'react'
import { Menu as AntMenu, Row, Dropdown, Icon } from 'antd'
import ButtonTransparent from '../../common/elements/ButtonTransparent'

import styles from './header.less'

const menu = (
  <AntMenu>
    <AntMenu.Item>
      <a target="_blank" rel="noopener noreferrer" href="">1st menu item</a>
    </AntMenu.Item>
    <AntMenu.Item>
      <a target="_blank" rel="noopener noreferrer" href="">2nd menu item</a>
    </AntMenu.Item>
  </AntMenu>
);

const Logo = function ({ ...props }) {
  return (
    <Row type="flex" align="middle" className={styles.logo}>
      <Dropdown
        overlay={menu}
        trigger={['click']}
      >
        <ButtonTransparent><Icon type="content-43" /></ButtonTransparent>
      </Dropdown>
      <img src="logo.png" alt="favicon" />
    </Row>
  )
}

export default Logo;
