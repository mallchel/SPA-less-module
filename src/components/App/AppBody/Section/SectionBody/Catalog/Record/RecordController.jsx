import _ from 'lodash'
import React from 'react'
import Record from './Record'
import { connect } from '../../../../../../StateProvider'
import recordActions from '../../../../../../../actions/recordActions'
import apiActions from '../../../../../../../actions/apiActions'

const RecordController = React.createClass({
  componentDidMount() {
    const recordId = this.props.recordId;
    const catalogId = this.props.catalogId;

    if (recordId == '$new') {
      recordActions.createNewRecord({ catalogId });
    } else if (recordId && catalogId) {
      apiActions.getRecord({ recordId, catalogId: this.props.catalogId });
    }
    catalogId && apiActions.getCatalog({ catalogId: this.props.catalogId });
  },

  render() {
    let currentCatalogId = this.props.appState.getIn(['routeParams', 'catalogId']);
    let currentRecordId = this.props.appState.getIn(['routeParams', 'recordId']);
    currentRecordId = currentRecordId ? currentRecordId : this.props.appState.getIn(['newRecordId', currentCatalogId]);

    let record = this.props.appState.getIn(['records', currentCatalogId, currentRecordId]);

    return (
      <Record
        ref="record"
        key={currentCatalogId + '_' + currentRecordId}
        record={record}
        onClickTab={this.onClickTab}
        onSaveField={this.onSaveField}
        onCreateRecord={this.onCreateRecord}
        catalog={this.props.appState.get('currentCatalog')}
        catalogId={this.props.appState.getIn(['routeParams', 'catalogId'])}
        routeRecordId={this.props.appState.getIn(['routeParams', 'recordId'])} />
    );
  }

});

export default connect(RecordController, ['catalogs', 'records']);
