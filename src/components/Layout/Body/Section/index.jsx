import React, { Component } from 'react'
// import { Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Row, Col } from 'antd'
import apiActions from '../../../../actions/apiActions'
import DefaultRedirect from '../../../common/router/DefaultRedirect'
import NavRoute from '../../../common/router/Route'
import routes from '../../../../routes'
// import Header from './Header'

import PRIVILEGE_CODES from '../../../../configs/privilegeCodes'
import RESOURCE_TYPES from '../../../../configs/resourceTypes'
import { checkAccessOnObject } from '../../../../utils/rights'

import CatalogsMenu from './Header/CatalogsMenu'
import SectionHeader from './Header/SectionHeader'
import Body from './Body'

import styles from './section.less'

class Section extends Component {
  static propTypes = {
    appState: PropTypes.object.isRequired
  }
  componentDidMount() {
    apiActions.getCatalogs();

    const sectionId = this.props.appState.getIn(['route', 'params', 'sectionId']);
    if (sectionId) {
      apiActions.getSection({ sectionId });
    }
  }
  componentWillReceiveProps(nextProps) {
    const newSectionId = nextProps.appState.getIn(['route', 'params', 'sectionId']);

    if (newSectionId && this.props.appState.getIn(['route', 'params', 'sectionId']) !== newSectionId) {
      // update catalogs.
      apiActions.getCatalogs();
      apiActions.getSection({ sectionId: newSectionId });
    }
  }
  render() {
    const sectionId = this.props.appState.getIn(['route', 'params', 'sectionId']);
    const catalogs = this.props.appState.get('catalogs').valueSeq().filter(c => c.get('sectionId') === sectionId);
    const section = this.props.appState.getIn(['sections', sectionId]);
    const currentCatalog = this.props.appState.get('currentCatalog');
    // todo: check access for
    const isAccessAdmin = checkAccessOnObject(RESOURCE_TYPES.SECTION, section, PRIVILEGE_CODES.ADMIN);

    return (
      <div className={styles.container}>
        <NavRoute route={routes.section} render={props => {
          {/*<Header
            sectionId={sectionId}
            catalogs={catalogs}
            section={section}
            currentCatalog={currentCatalog}
            {...props}
          />*/}
          return (
            <Row type="flex" justify="space-between" align="middle" className={styles.header}>
              <DefaultRedirect route='catalog' path='/catalog/:catalogId' object={catalogs.get(0)} />
              <Col>
                <CatalogsMenu
                  sectionId={sectionId}
                  catalogs={catalogs}
                  currentIdCatalog={currentCatalog && currentCatalog.get('id')}
                  isAccessAdmin={isAccessAdmin}
                />
              </Col>
              <Col>
                <SectionHeader
                  sectionId={sectionId}
                  section={section}
                  isAccessAdmin={isAccessAdmin}
                />
              </Col>
            </Row>
          )
        }} />
        <Body { ...this.props } />
      </div>
    )
  }
}

export default Section;
