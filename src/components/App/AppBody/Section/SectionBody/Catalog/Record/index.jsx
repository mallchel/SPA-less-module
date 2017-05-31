import React, { Component } from 'react'
// import { Prompt } from 'react-router-dom'
import appState from '../../../../../../../appState'
import apiActions from '../../../../../../../actions/apiActions'
import recordActions from '../../../../../../../actions/recordActions'
import Loading from '../../../../../../common/Loading'
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
    const recordId = this.props.recordId;
    const catalogId = this.props.catalogId;
    if (recordId && catalogId) {
      apiActions.getRecord({ recordId, catalogId: this.props.catalogId });
    }
    catalogId && apiActions.getCatalog({ catalogId: this.props.catalogId });
  }


  componentWillReceiveProps(nextProps) {
    const recordId = this.props.recordId;
    const newRecordId = nextProps.recordId;

    if (newRecordId && newRecordId !== recordId) {
      apiActions.getRecord({ recordId: newRecordId, catalogId: nextProps.catalogId });
    }
  }

  onSaveField(data) {
    let updateParams;
    if (data.values) {
      updateParams = data.values;
    } else {
      updateParams = data.data;
    }
    recordActions.updateRecordValue(data.catalogId, data.recordId, data.fieldId, updateParams);
  }

  render() {
    const recordId = this.props.recordId;
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
          //onSave={this.onSave}
          record={record}
          catalogId={this.props.catalogId}
          specialPrivileges={record.get('fieldPrivilegeCodes')}
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
