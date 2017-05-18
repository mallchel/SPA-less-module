import React, { Component } from 'react'
import { Row, Col } from 'antd'
import PropTypes from 'prop-types'
import DefaultRedirect from '../../../common/router/DefaultRedirect'
import apiActions from '../../../../actions/apiActions'
import Menu from './Menu'
import SettingSection from './SettingSection'

import PRIVILEGE_CODES from '../../../../configs/privilegeCodes'
import RESOURCE_TYPES from '../../../../configs/resourceTypes'
import { checkAccessOnObject } from '../../../../utils/rights'

import styles from './headerCatalog.less'

class HeaderCatalog extends Component {
  static propTypes = {
    appState: PropTypes.object.isRequired
  }

  componentDidMount() {
    apiActions.getCatalogs();

    let sectionId = this.props.match.params.sectionId;
    if (sectionId) {
      apiActions.getSection({ sectionId });
    }
  }

  componentWillReceiveProps(nextProps) {
    const newSectionId = nextProps.match.params.sectionId;

    if (newSectionId && this.props.match.params.sectionId !== newSectionId) {
      // update catalogs.
      apiActions.getCatalogs();
      apiActions.getSection({ sectionId: newSectionId });
    }
  }

  render() {
    const sectionId = this.props.match.params.sectionId;
    const catalogs = this.props.appState.get('catalogs').valueSeq().filter(c => c.get('sectionId') === sectionId);
    const section = this.props.appState.getIn(['sections', sectionId]);
    const currentCatalog = this.props.appState.get('currentCatalog');
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
