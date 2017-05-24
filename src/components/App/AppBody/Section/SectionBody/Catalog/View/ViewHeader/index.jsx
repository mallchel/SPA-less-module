import React from 'react'
import { Menu as AntMenu, Row, Col, Dropdown, Icon } from 'antd'
import Immutable from 'immutable'
import TabsMenu from '../../../../../../../common/menu/TabsMenu'
import routes from '../../../../../../../../routes'

import styles from './viewHeader.less'

const menu = (
  <AntMenu>
    <AntMenu.Item key="0">
      <a href="#">1st AntMenu item</a>
    </AntMenu.Item>
    <AntMenu.Item key="1">
      <a href="#">2nd AntMenu item</a>
    </AntMenu.Item>
    <AntMenu.Divider />
    <AntMenu.Item key="3">
      <a href="#">3d AntMenu item</a>
    </AntMenu.Item>
  </AntMenu>
);

const tabs = Immutable.List([
  Immutable.Map({
    id: 'record',
    name: 'Записи',
    route: routes.records
  }),
  Immutable.Map({
    id: 'reports',
    name: 'Отчеты',
    route: routes.reports
  }),
  Immutable.Map({
    id: 'history',
    name: 'Активность',
    route: routes.history
  })
]);

const ViewHeader = function () {

  return (
    <Row type="flex" justify="space-between" align="middle" className={styles.header}>
      <Col>
        <TabsMenu
          items={tabs}
          className={styles.tabsMenu}
        />
      </Col>

      <Col>
        <input placeholder="быстрый поиск" className={styles.input} />
      </Col>

      <Col>
        <Row type="flex" justify="space-between" align="middle">
          {/*<Icon type="content-42" />*/}
          <Dropdown.Button type="primary" overlay={menu}>
            <Icon type="interface-72" />Создать
          </Dropdown.Button>
        </Row>
      </Col>
    </Row>
  )
}

export default ViewHeader;
