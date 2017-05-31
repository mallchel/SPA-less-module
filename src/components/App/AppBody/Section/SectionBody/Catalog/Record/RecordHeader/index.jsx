import React from 'react'
import PropTypes from 'prop-types'
import trs from '../../../../../../../../getTranslations'
import apiActions from '../../../../../../../../actions/apiActions'
import recordActions from '../../../../../../../../actions/recordActions'
import modalsActions from '../../../../../../../../actions/modalsActions'
// import RecordFactory from '../../../../../../../../models/RecordFactory'
import appState from '../../../../../../../../appState'
import { confirm } from '../../../../../../../common/Modal'
import NavRoute from '../../../../../../../common/router/Route'
import routes from '../../../../../../../../routes'
import RecordActivities from './RecordActivities'

import PRIVILEGE_CODES from '../../../../../../../../configs/privilegeCodes'
import RESOURCE_TYPES from '../../../../../../../../configs/resourceTypes'
import { checkAccessOnObject } from '../../../../../../../../utils/rights'

import styles from './recordHeader.less'

const RecordHeader = React.createClass({
  propTypes: {
    record: PropTypes.object.isRequired,
    catalog: PropTypes.object.isRequired,
    catalogId: PropTypes.string.isRequired,
    hasBeenEdit: PropTypes.bool.isRequired
    //onSave: React.PropTypes.func.isRequired,
    //onCreateRecord: React.PropTypes.func.isRequired
  },

  onCreateRecord(catalogId, values) {
    appState.setIn(['records', catalogId, appState.getIn(['newRecordId', catalogId]), 'creating'], true);
    appState.setIn(['records', catalogId, appState.getIn(['newRecordId', catalogId]), 'createError'], null);
    appState.changed();
    recordActions.validateAndSaveRecord(catalogId, appState.getIn(['newRecordId', catalogId]), values, (result) => {
      let oldRecordId = appState.getIn(['newRecordId', catalogId]);
      let newRecordId = result.id;

      // if (router.includes('main.section.catalogData.addRecord', { catalogId: catalogId })) {
      //   let record = appState.getIn(['records', catalogId, oldRecordId]);
      //   appState.setIn(['records', catalogId, newRecordId], RecordFactory.create({
      //     id: newRecordId,
      //     values: record.get('values'),
      //     fields: record.get('fields'),
      //     privilegeCode: PRIVILEGE_CODES.EDIT
      //   }));

      //   router.go('main.section.catalogData.record', {
      //     catalogId: catalogId,
      //     recordId: newRecordId
      //   });

      //   // clear in timeout to record not rerender while router in change progress
      //   setTimeout(function () {
      //     appState.deleteIn(['newRecordId', catalogId]);
      //     appState.deleteIn(['records', catalogId, oldRecordId]);
      //     appState.changed();
      //   });

      //   recordActions.requestForRecords(catalogId);
      // }
    });
  },

  onClickCreate() {
    let newRecordId = appState.getIn(['newRecordId', this.props.catalogId]);
    let values = appState.getIn(['records', this.props.catalogId, newRecordId, 'values']).toJS();
    this.onCreateRecord(this.props.catalogId, values);
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

  onClickClose() {
    // router.go('main.section.catalogData');
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

  onClone() {
    recordActions.cloneRecord({
      catalogId: this.props.catalogId,
      recordId: this.props.record.get('id'),
    })
  },

  render() {
    const record = this.props.record;
    const isNew = record.get('isNew');
    const headerText = isNew ? trs('record.newRecord') : record.get('title');

    return (
      <div className={styles.container}>
        <h1 title={headerText}>
          <span>{headerText}</span>
        </h1>

        <NavRoute route={routes.record} render={
          ({ match }) => {
            return <RecordActivities
              record={record}
              catalog={this.props.catalog}
              viewId={match.params.viewId}
              hasBeenEdit={this.props.hasBeenEdit}
              onClone={this.onClone}
              onRemove={this.onRemove}
              onClickCreate={this.onClickCreate}
              onClickAccess={this.onClickAccess}
            />
          }
        } />

        {/*<span onClick={this.onClickClose}></span>*/}
      </div>
    );
  }

});

export default RecordHeader;
