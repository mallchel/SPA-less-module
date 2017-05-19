import React, { Component } from 'react'
// import { Redirect } from 'react-router-dom'
import { Row, Col } from 'antd'
// import routes from '../../../../routes'
import apiActions from '../../../../actions/apiActions'
import DefaultRedirect from '../../../common/router/DefaultRedirect'
import Logo from './Logo'
import Menu from './Menu'
import Profile from './Profile'

import styles from './headerSection.less'

class HeaderSection extends Component {
  componentDidMount() {
    apiActions.getSections();
    apiActions.getPrivileges();
    apiActions.getCompanyInfo(window.location.host.split('.')[0]);
  }

  render() {
    const sections = this.props.appState.get('sections').sortBy(s => s.get('name').toLowerCase()).valueSeq().map(s => s.remove('icon'));

    return (
      <Row type="flex" justify="space-between" align="middle" className={styles.container}>
        <DefaultRedirect route='section' path='/section/:sectionId' object={this.props.appState.get('sections').valueSeq().get(0)} />

        <Col>
          <Logo {...this.props} />
        </Col>

        <Col className={styles.menuContainer}>
          <Menu
            sections={sections}
           />
        </Col>

        <Col>
          <Profile {...this.props} />
        </Col>
      </Row>
    )
  }
}

export default HeaderSection;
