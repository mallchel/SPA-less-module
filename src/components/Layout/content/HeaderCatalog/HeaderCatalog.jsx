import React, { Component } from 'react'
import { Menu as AntMenu, Dropdown, Icon, Row, Col } from 'antd'
import PropTypes from 'prop-types'
// import routes from '../../../../routes'
import DefaultRedirect from '../../../common/router/DefaultRedirect'
// import ListMenu from '../../../common/menu/ListMenu'
import ButtonTransparent from '../../../common/elements/ButtonTransparent'
import apiActions from '../../../../actions/apiActions'
import Menu from './Menu'

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

    let sectionId = this.props.match.params.sectionId;

    if (sectionId) {
      apiActions.getSection({ sectionId });
    }
  }
  componentWillReceiveProps(nextProps) {
  }
  render() {
    const sectionId = this.props.match.params.sectionId;
    const catalogs = this.props.appState.get('catalogs').valueSeq().filter(c => c.get('sectionId') === sectionId);

    return (
      <Row type="flex" justify="space-between" align="middle" className={styles.container}>
        <DefaultRedirect route='catalog' path='/catalog/:catalogId' object={catalogs.get(0)} />

        <Col>
          <Menu {...this.props} />
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

HeaderCatalog.propTypes = {
  appState: PropTypes.object.isRequired
}

export default HeaderCatalog;
