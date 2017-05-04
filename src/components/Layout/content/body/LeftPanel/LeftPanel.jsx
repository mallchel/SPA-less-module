import React, { Component } from 'react'
import { Menu as AntMenu, Row, Col, Dropdown, Icon } from 'antd'
import ButtonTransparent from '../../../../common/elements/ButtonTransparent'
import styles from './leftPanel.less'

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

class LeftPanel extends Component {
  render() {
    return (
      <div className={styles.container}>
        <Col>
          <Row type="flex" justify="space-between" align="middle" className={styles.header}>
            <h2>Клиенты</h2>
            <Dropdown
              overlay={menu}
              trigger={['click']}
              placement="bottomRight"
            >
              <ButtonTransparent className={styles.icon}><Icon type="setting-10" /></ButtonTransparent>
            </Dropdown>
          </Row>
        </Col>

        <Col>
          <Row type="flex" className={styles.body}>
            <div>asdasasd
            asdasasdasas
            asdas
            sdfsdf
            </div>
          </Row>
        </Col>
      </div>
    )
  }
}

export default LeftPanel;
