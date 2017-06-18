import React, { Component } from 'react'
import { Row, Col } from 'antd'
import PropTypes from 'prop-types'
import apiActions from '../../../actions/apiActions'
import Logo from './Logo'
import SectionsMenu from './SectionsMenu'
import Profile from './Profile'

import styles from './appHeader.less'

class AppHeader extends Component {
  componentDidMount() {
    apiActions.getFilterKeys();
    apiActions.getPrivileges();
    apiActions.getCompanyInfo(window.location.host.split('.')[0]);
  }

  render() {
    return (
      <Row type="flex" justify="space-between" align="middle" className={styles.container}>
        <Col>
          <Logo />
        </Col>

        <Col className={styles.menuContainer}>
          <SectionsMenu />
        </Col>

        <Col>
          <Profile />
        </Col>
      </Row>
    )
  }
}

export default AppHeader;
