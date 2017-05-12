import React, { Component } from 'react'
import { Menu as AntMenu, Dropdown, Icon, Row, Col } from 'antd'
import Immutable from 'immutable'
import routes from '../../../../routes'
import ListMenu from '../../../common/menu/ListMenu'
import ButtonTransparent from '../../../common/elements/ButtonTransparent'
import styles from './headerCatalog.less'

const menu = (
  <AntMenu>
    <AntMenu.Item key="0">
      <a href="#">1st Antmenu item</a>
    </AntMenu.Item>
    <AntMenu.Item key="1">
      <a href="#">2nd Antmenu item</a>
    </AntMenu.Item>
    <AntMenu.Divider />
    <AntMenu.Item key="3">
      <a href="#">3d Antmenu item</a>
    </AntMenu.Item>
  </AntMenu>
);

const catalogs = Immutable.fromJS([
  {
    id: 1,
    name: 'Клиенты',
    icon: "vote-27"
  },
  {
    id: 2,
    name: 'Заказы клиентов',
    icon: "communication-47"
  },
  {
    id: 3,
    name: 'Проекты',
    icon: "business-81"
  },
  {
    id: 4,
    name: 'Добавить',
    icon: "interface-69"
  },
])

class HeaderCatalog extends Component {
  render() {
    return (
      <Row type="flex" justify="space-between" align="middle" className={styles.container}>
        <Col>
          <ListMenu
            params='catalogId'
            route={routes.catalog}
            items={catalogs}
            className={styles.shiftLeft}
          />
        </Col>
        <Col>
          Продажи
          <Dropdown
            overlay={menu}
            trigger={['click']}
          >
            <ButtonTransparent className={styles.shiftRight}><Icon type="setting-10" /></ButtonTransparent>
          </Dropdown>
        </Col>
      </Row>
    )
  }
}

export default HeaderCatalog;
