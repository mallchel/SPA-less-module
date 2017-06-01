import React, { Component } from 'react'
// import { Prompt } from 'react-router-dom'
import Immutable from 'immutable'
import _ from 'lodash'
import appState from '../../../../../../../appState'
import apiActions from '../../../../../../../actions/apiActions'
import recordActions from '../../../../../../../actions/recordActions'
import Loading from '../../../../../../common/Loading'
import RecordFactory from '../../../../../../../models/RecordFactory'
import RecordHeader from './RecordHeader'
import RecordData from './RecordData'

import { checkAccessOnObject } from '../../../../../../../utils/rights'
import PRIVILEGE_CODES from '../../../../../../../configs/privilegeCodes'
import RESOURCE_TYPES from '../../../../../../../configs/resourceTypes'

import styles from './record.less'

class Record extends Component {
  state = {
    hasBeenEdit: false
  }

  componentDidMount() {
    // const recordId = this.props.recordId;
    // const catalogId = this.props.catalogId;

    // console.log('mount: ', recordId, "catalog: ", catalogId);
    // if (recordId == '$new') {

      // this.recordId = recordActions.createNewRecord({ catalogId });
      // console.log('create in mount: ',this.recordId );
    // } else if (recordId && catalogId) {
      // apiActions.getRecord({ recordId, catalogId: this.props.catalogId });
      // this.recordId = recordId;
    // }
    // catalogId && apiActions.getCatalog({ catalogId: this.props.catalogId });
  }


  componentWillReceiveProps(nextProps) {
    // let recordId = this.props.recordId;
    // let newRecordId = nextProps.recordId;
    // const newCatalogId = nextProps.catalogId;


    // if (!newCatalogId) { return; } // not enough values

    // console.log(recordId, newRecordId, this.recordId)

    // if (newRecordId == '$new' && ( newRecordId !== recordId || ! this.recordId ) )  {
    //   // console.log('NEW');
    //   recordActions.createNewRecord({ catalogId: newCatalogId });

    //   apiActions.getCatalog({ catalogId: newCatalogId });
    //   // this.recordId = appState.getIn(['newRecordId', newCatalogId]);
    // } else if (newRecordId !== recordId) {
    //   apiActions.getRecord({ recordId: newRecordId, catalogId: newCatalogId });
    //   apiActions.getCatalog({ catalogId: newCatalogId });
    //   // this.recordId = newRecordId;
    // }

    // if (!newCatalogId) { return; } // not enough values
    // if (newRecordId === recordId && this.recordId) { return; } // nothing changed


    // if (newRecordId == '$new') {
    //   if (newRecordId !== recordId) {
    //     this.recordId = null
    //   } else if (!this.recordId) {
    //     recordActions.createNewRecord({ catalogId: newCatalogId })
    //     apiActions.getCatalog({ catalogId: newCatalogId });

    //     console.log('create');

    //     this.recordId = appState.getIn(['newRecordId', newCatalogId]);
    //   }
    //   //} else {
    //   //this.recordId = null;
    //   //}
    // } else {
    //   console.log('LOA');
    //   apiActions.getRecord({ recordId: newRecordId, catalogId: newCatalogId });
    //   apiActions.getCatalog({ catalogId: newCatalogId });
    //   this.recordId = newRecordId;
    // }

    // if (newRecordId == '$new' && (this.recordId && newRecordId !== recordId)) {
    //   this.recordId = null
    //   recordActions.createNewRecord({ catalogId: newCatalogId });
    //   apiActions.getCatalog({ catalogId: newCatalogId });

    // } else if (newRecordId == '$new' && !this.recordId) {
    //   this.recordId = appState.getIn(['newRecordId', newCatalogId]);

    // } else if (newRecordId && newRecordId !== recordId) {
    //   apiActions.getRecord({ recordId: newRecordId, catalogId: newCatalogId });
    //   this.recordId = newRecordId;
    //   apiActions.getCatalog({ catalogId: newCatalogId });
    // }
  }

  onSaveField = (data) => {
    let recordId = this.props.recordId;
    let record = appState.getIn(['records', this.props.catalogId, recordId]);
    let newValue = data.data;
    let fieldId = data.fieldId;
    let oldValue = record.getIn(['originValues', fieldId]);

    let isChanged = _.isObject(newValue)
      ? !Immutable.is(newValue, oldValue)
      : newValue !== oldValue;

    if (isChanged) {
      // пришли изменения
      this.setState({ hasBeenEdit: true });
    }

    this.saveField({
      catalogId: this.props.catalogId,
      recordId: recordId,
      fieldId: fieldId,
      data: newValue
    });
  }

  saveField(data) {
    let updateParams;
    if (data.values) {
      updateParams = data.values;
    } else {
      updateParams = data.data;
    }
    recordActions.updateRecordValue(data.catalogId, data.recordId, data.fieldId, updateParams);
  }

  onSave = () => {
    let catalogId = this.props.catalogId;
    let recordId = this.props.recordId;
    let record = appState.getIn(['records', catalogId, recordId]);
    let oldValues = record.get('originValues');
    let newValues = record.get('values');
    let values = newValues.filter((newValue, fieldId) => {
      let oldValue = oldValues.get(fieldId);
      return _.isObject(newValue)
        ? !Immutable.is(newValue, oldValue)
        : newValue !== oldValue;
    });
    values = values.toJS();
    recordActions.validateAndSaveRecord(catalogId, recordId, values, () => {
      appState.setIn(['records', catalogId, recordId, 'saving'], false);
      appState.setIn(['records', catalogId, recordId, 'creating'], false);
      appState.changed();
      this.setState({ hasBeenEdit: false });

    }, () => {
      appState.setIn(['records', catalogId, recordId, 'saving'], false);
      appState.setIn(['records', catalogId, recordId, 'creating'], false);
      appState.changed();
    });
  }

  onCreateRecord = (catalogId, values, { history, link }) => {
    appState.setIn(['records', catalogId, appState.getIn(['newRecordId', catalogId]), 'creating'], true);
    appState.setIn(['records', catalogId, appState.getIn(['newRecordId', catalogId]), 'createError'], null);
    appState.changed();
    recordActions.validateAndSaveRecord(catalogId, appState.getIn(['newRecordId', catalogId]), values, (result) => {
      let oldRecordId = appState.getIn(['newRecordId', catalogId]);
      let newRecordId = result.id;

      // if (router.includes('main.section.catalogData.addRecord', { catalogId: catalogId })) {
      let record = appState.getIn(['records', catalogId, oldRecordId]);
      appState.setIn(['records', catalogId, newRecordId], RecordFactory.create({
        id: newRecordId,
        values: record.get('values'),
        fields: record.get('fields'),
        privilegeCode: PRIVILEGE_CODES.EDIT
      }));

      history.push(`${link}/${newRecordId}`);
      this.setState({ hasBeenEdit: false });

      // clear in timeout to record not rerender while router in change progress
      setTimeout(function () {
        appState.deleteIn(['newRecordId', catalogId]);
        appState.deleteIn(['records', catalogId, oldRecordId]);
        appState.changed();
      });

      recordActions.requestForRecords(catalogId);
      // }
    });
  }

  render() {
    let recordId = this.props.recordId;
    const catalogId = this.props.catalogId;
    const record = appState.getIn(['records', catalogId, recordId]);
    const catalog = appState.getIn(['catalogs', catalogId]);

    if (!record || !catalog || !catalog.get('fields')) {
      return (
        <div>
          <Loading fullHeight={true} />
        </div>
      )
    }

    let readOnly = true;

    if (record.getIn(['isNew'])) {
      readOnly = false;
    } else {
      readOnly = !checkAccessOnObject(RESOURCE_TYPES.RECORD, record, PRIVILEGE_CODES.EDIT);
    }

    return (
      <div className={styles.container}>
        {/*<Prompt
          when={true}
          message={e => 'asdasdasd'}
        />*/}
        <RecordHeader
          catalog={catalog}
          hasBeenEdit={this.state.hasBeenEdit}
          onSave={this.onSave}
          record={record}
          catalogId={this.props.catalogId}
          specialPrivileges={record.get('fieldPrivilegeCodes')}
          onCreateRecord={this.onCreateRecord}
        />

        <RecordData
          disableAutoSave={true}
          unsavedFields={this.props.unsavedFields}
          onSaveField={this.onSaveField}
          record={record}
          readOnly={readOnly}
          catalog={catalog}
        />
      </div>
    )
  }
}

export default Record;
