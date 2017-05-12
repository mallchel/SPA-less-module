import React, { Component } from 'react'
import { Row, Col } from 'antd'
import routes from '../../../../routes'
import apiActions from '../../../../actions/apiActions'
import DefaultRedirect from '../../../common/router/DefaultRedirect'
import Logo from './Logo'
import Menu from './Menu'
import Profile from './Profile'

import styles from './headerSection.less'

class HeaderSection extends Component {
  componentDidMount() {
    // our init app-point...
    apiActions.getSections();
    apiActions.getCompanyInfo(window.location.host.split('.')[0]);
  }

  render() {
    return (
      <Row type="flex" justify="space-between" align="middle" className={styles.container}>
        <DefaultRedirect route={routes.section} object={this.props.appState.get('sections').valueSeq().get(0)} />

        <Col>
          <Logo {...this.props} />
        </Col>

        <Col className={styles.menuContainer}>
          <Menu {...this.props} />
        </Col>

        <Col>
          <Profile {...this.props} />
        </Col>
      </Row>
    )
  }
}

export default HeaderSection;
