import React, { Component } from 'react'
import { Row, Col } from 'antd'
import PropTypes from 'prop-types'
import apiActions from '../../../actions/apiActions'
import DefaultRedirect from '../../common/router/DefaultRedirect'
import routes from '../../../routes'
import Logo from './Logo'
import SectionsMenu from './SectionsMenu'
import Profile from './Profile'

import styles from './appHeader.less'

class AppHeader extends Component {
  static PropTypes = {
    appState: PropTypes.object.isRequired
  }
  componentDidMount() {
    apiActions.getFilterKeys();
    apiActions.getPrivileges();
    apiActions.getCompanyInfo(window.location.host.split('.')[0]);
  }

  render() {
    // const sections = this.props.appState.get('sections').sortBy(s => s.get('name').toLowerCase()).valueSeq().map(s => s.remove('icon'));

    return (
      <Row type="flex" justify="space-between" align="middle" className={styles.container}>
        <DefaultRedirect route={routes.section} params='sectionId' object={this.props.appState.get('sections').valueSeq().get(0)} />

        <Col>
          <Logo {...this.props} />
        </Col>

        <Col className={styles.menuContainer}>
          <SectionsMenu {...this.props} />
        </Col>

        <Col>
          <Profile {...this.props} />
        </Col>
      </Row>
    )
  }
}

export default AppHeader;
