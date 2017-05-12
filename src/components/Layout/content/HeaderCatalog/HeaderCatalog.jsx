import React, { Component } from 'react'
import { Menu as AntMenu, Dropdown, Icon, Row, Col } from 'antd'
import routes from '../../../../routes'
import ListMenu from '../../../common/menu/ListMenu'
import ButtonTransparent from '../../../common/elements/ButtonTransparent'
import apiActions from '../../../../actions/apiActions'
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

class HeaderCatalog extends Component {
  componentDidMount() {
    apiActions.getCatalogs();
  }
  render() {
    const sectionId = this.props.match.params.sectionId;
    const catalogs = this.props.appState.get('catalogs').valueSeq().filter(c => c.get('sectionId') === sectionId);

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
