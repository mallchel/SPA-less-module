import React, { Component } from 'react'
import { Row, Col } from 'antd'
import Immutable from 'immutable'
import PropTypes from 'prop-types'
import TabsMenu from '../../../../../../../common/menu/TabsMenu'
import NavRoute from '../../../../../../../common/router/Route'
import routes from '../../../../../../../../routes'
import RecordActivities from './RecordActivities'

import styles from './viewHeader.less'

class ViewHeader extends Component {
  static PropTypes = {
    catalog: PropTypes.object,
    viewId: PropTypes.string
  }
  render() {
    const countRecord = this.props.catalog && this.props.catalog.get('recordsCount');
    const tabs = Immutable.List([
      Immutable.Map({
        id: 'record',
        name: `Записи ${countRecord || ''}`,
        route: routes.records
      }),
      Immutable.Map({
        id: 'reports',
        name: 'Отчеты',
        route: routes.reports
      }),
      Immutable.Map({
        id: 'history',
        name: 'Активность',
        route: routes.history
      })
    ]);

    const catalog = this.props.catalog;
    const viewId = this.props.viewId;

    return (
      <Row type="flex" justify="space-between" align="middle" className={styles.container}>
        <Col>
          <TabsMenu
            items={tabs}
            className={styles.tabsMenu}
          />
          {/*<NavRoute route={routes.records} render={props => {
            return (
            )
          }} />*/}
        </Col>

        <Col>
          <NavRoute route={routes.records} render={props => {
            return (
              <input placeholder="быстрый поиск" className={styles.input} />
            )
          }} />
        </Col>

        <Col>
          <Row type="flex" justify="space-between" align="middle">
            <NavRoute route={routes.records} render={props => {
              return (
                <RecordActivities catalog={catalog} viewId={viewId} />
              )
            }} />
          </Row>
        </Col>
      </Row>
    )
  }
}

export default ViewHeader;
