import React, { Component } from 'react'
import { Row, Col } from 'antd'
// import PropTypes from 'prop-types'
import DefaultRedirect from '../../../common/router/DefaultRedirect'
// import apiActions from '../../../../actions/apiActions'
import Menu from './Menu'
import SettingSection from './SettingSection'

import PRIVILEGE_CODES from '../../../../configs/privilegeCodes'
import RESOURCE_TYPES from '../../../../configs/resourceTypes'
import { checkAccessOnObject } from '../../../../utils/rights'

import styles from './headerCatalog.less'

class HeaderCatalog extends Component {
  render() {
    const { props: { section, sectionId, catalogs, currentCatalog } } = this;
    // todo: check access for
    const isAccessAdmin = checkAccessOnObject(RESOURCE_TYPES.SECTION, section, PRIVILEGE_CODES.ADMIN);

    return (
      <Row type="flex" justify="space-between" align="middle" className={styles.container}>
        <DefaultRedirect route='catalog' path='/catalog/:catalogId' object={catalogs.get(0)} />
        <Col>
          <Menu
            sectionId={sectionId}
            catalogs={catalogs}
            currentIdCatalog={currentCatalog && currentCatalog.get('id')}
            isAccessAdmin={isAccessAdmin}
          />
        </Col>
        <Col>
          <SettingSection
            sectionId={sectionId}
            section={section}
            isAccessAdmin={isAccessAdmin}
          />
        </Col>
      </Row>
    )
  }
}

export default HeaderCatalog;
