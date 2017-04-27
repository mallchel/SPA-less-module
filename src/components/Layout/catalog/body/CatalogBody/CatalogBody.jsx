import React, { Component } from 'react'
import { Menu as AntMenu, Row, Col, Dropdown, Icon, Button } from 'antd'
import routes from '../../../../../routes'
import TabsMenu from '../../../../common/menu/TabsMenu'
import styles from './catalogBody.less'

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

const tabs = [
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
];

class CatalogBody extends Component {
  render() {
    console.log(this.props)
    return (
      <div className={styles.container}>
        <Col>
          <Row type="flex" justify="space-between" align="middle" className={styles.header}>
            <Col>
              <TabsMenu
                params='tabId'
                route={routes.tab}
                items={tabs}
                className="shiftLeft"
              />
            </Col>

            <Col>
              <input placeholder="быстрый поиск" className={styles.input} />
            </Col>

            <Col>
              <Row type="flex" justify="space-between" align="middle">
                <Icon type="content-42" style={{ cursor: 'pointer' }} />
                <div className="ant-btn-group ant-dropdown-button" style={{ display: 'flex' }}>
                  <Button type="primary" style={{ display: 'flex', alignItems: 'center' }}><Icon type="interface-72"></Icon>Создать</Button>
                  <Button style={{ display: 'flex', alignItems: 'center' }}>
                    <Dropdown
                      overlay={menu}
                      trigger={['click']}
                    >
                      <Icon type="arrows-chevron-medium-thin-4-01" />
                    </Dropdown>
                  </Button>
                </div>
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

export default CatalogBody;
