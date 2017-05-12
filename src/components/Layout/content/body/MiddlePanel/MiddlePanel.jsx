import React, { Component } from 'react'
import { Menu as AntMenu, Row, Col, Dropdown, Icon } from 'antd'
import Immutable from 'immutable'
import routes from '../../../../../routes'
import TabsMenu from '../../../../common/menu/TabsMenu'
import styles from './middlePanel.less'

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

const tabs = Immutable.fromJS([
  {
    id: 'record',
    name: 'Записи'
  },
  {
    id: 'reports',
    name: 'Отчеты'
  },
  {
    id: 'history',
    name: 'Активность'
  }
]);

class MiddlePanel extends Component {
  render() {
    return (
      <div className={styles.container}>
        <Col>
          <Row type="flex" justify="space-between" align="middle" className={styles.header}>
            <Col>
              <TabsMenu
                params='tabId'
                route={routes.tab}
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
        </Col>
        <Col>
          <Row className={styles.body}>
            sadasdasdasd
        </Row>
        </Col>
      </div>
    )
  }
}

export default MiddlePanel;
