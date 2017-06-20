import React from 'react'
import PropTypes from 'prop-types'
import Immutable from 'immutable'
import _ from 'lodash'
import { Row } from 'antd'
import trs from '../../../../../../../../getTranslations'
import apiActions from '../../../../../../../../actions/apiActions'
import recordActions from '../../../../../../../../actions/recordActions'
import modalsActions from '../../../../../../../../actions/modalsActions'
import appState from '../../../../../../../../appState'
import { confirm } from '../../../../../../../common/Modal'
import NavRoute from '../../../../../../../common/router/Route'
import NavRedirect from '../../../../../../../common/router/Redirect'
import routes from '../../../../../../../../routes'
import TabsMenu from '../../../../../../../common/menu/TabsMenu'
import RecordActivities from './RecordActivities'
import getLink from '../../../../../../../common/router/getLink'
import ButtonClose from '../../../../../../../common/elements/ButtonClose'

import PRIVILEGE_CODES from '../../../../../../../../configs/privilegeCodes'
import RESOURCE_TYPES from '../../../../../../../../configs/resourceTypes'
import { checkAccessOnObject } from '../../../../../../../../utils/rights'

import styles from './recordHeader.less'

const RecordHeader = React.createClass({
  propTypes: {
    record: PropTypes.object.isRequired,
    catalog: PropTypes.object.isRequired,
    catalogId: PropTypes.string.isRequired,
    hasBeenEdit: PropTypes.bool.isRequired,
    onSave: React.PropTypes.func.isRequired,
    onCreateRecord: React.PropTypes.func.isRequired
  },

  onClickCreate(props) {
    let newRecordId = appState.getIn(['newRecordId', this.props.catalogId]);
    let values = appState.getIn(['records', this.props.catalogId, newRecordId, 'values']).toJS();
    this.props.onCreateRecord(this.props.catalogId, values, props);
  },

  onClickAccess() {
    let recordId = this.props.record.get('id');
    let catalogId = this.props.catalogId;
    if (catalogId && recordId) {
      let isAdmin = checkAccessOnObject(RESOURCE_TYPES.RECORD, this.props.record, PRIVILEGE_CODES.ADMIN);
      let readOnly = !checkAccessOnObject(RESOURCE_TYPES.RECORD, this.props.record, PRIVILEGE_CODES.ACCESS);
      let object = { catalogId, recordId };
      let parents = [
        {
          sectionId: this.props.catalog.get('sectionId')
        },
        {
          catalogId
        }
      ];
      modalsActions.openAccessModal({ object, parents }, RESOURCE_TYPES.RECORD, { readOnly, isAdmin });
    }
  },

  onClickClose({ history, linkToRecords }) {
    history.push(linkToRecords);
  },

  onRemove() {
    function onOk() {
      apiActions.deleteRecord({
        catalogId: this.props.catalogId,
        recordId: this.props.record.get('id')
      });
    }
    confirm({
      headerText: trs('modals.removeRecordConfirm.header'),
      text: trs('modals.removeRecordConfirm.text'),
      okText: trs('modals.removeRecordConfirm.okText'),
      cancelText: trs('modals.removeRecordConfirm.cancelText'),
      onOk
    });
  },

  onClone({ history, link }) {
    recordActions.cloneRecord({
      catalogId: this.props.catalogId,
      recordId: this.props.record.get('id'),
    });
    history.push(link);
  },

  render() {
    const tabs = Immutable.List([
      Immutable.Map({
        id: 'main',
        name: trs('record.tabs.main'),
        route: routes.recordMain
      }),
      Immutable.Map({
        id: 'history',
        name: trs('tab.history'),
        route: routes.recordHistory
      })
    ]);

    const record = this.props.record;
    const isNew = record.get('isNew');
    const headerText = isNew ? trs('record.newRecord') : record.get('title');

    return (
      <Row type="flex" justify="space-between" align="middle" className={styles.container}>
        <NavRoute route={routes.record} exact render={props => {
          return <NavRedirect route={tabs.getIn([0, 'route'])} />
        }} />
        <div className={styles.headerText}>
          <h1 title={headerText}>
            <span>{headerText}</span>
          </h1>
        </div>

        <TabsMenu
          items={tabs}
          className={styles.tabsMenu}
        />

        <NavRoute route={routes.record} render={
          ({ match, location, history }) => {
            const link = getLink(location, routes.record, { recordId: '$new' });
            const linkToRecords = getLink(location, routes.records);
            return (
              <Row type="flex" align="middle">
                <RecordActivities
                  record={record}
                  catalog={this.props.catalog}
                  viewId={match.params.viewId}
                  hasBeenEdit={this.props.hasBeenEdit}
                  onClone={() => this.onClone({ history, link })}
                  onRemove={this.onRemove}
                  onClickCreate={this.onClickCreate}
                  onClickAccess={this.onClickAccess}
                  onSave={this.props.onSave}
                />

                <ButtonClose
                  onClick={() => this.onClickClose({ history, linkToRecords })}
                  className={styles.close}
                />
              </Row>
            )
          }
        } />
      </Row>
    );
  }

});

export default RecordHeader;
