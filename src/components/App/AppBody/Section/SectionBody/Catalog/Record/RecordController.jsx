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

    if (recordId === '$new') {
      recordActions.createNewRecord({ catalogId });
    } else if (recordId && catalogId) {
      apiActions.getRecord({ recordId, catalogId: catalogId });
    }
    catalogId && apiActions.getCatalog({ catalogId: catalogId });
  },

  componentWillReceiveProps(nextProps) {
    const recordId = this.props.recordId;
    const newRecordId = nextProps.recordId;

    if (newRecordId === '$new' && newRecordId !== recordId) {
      recordActions.createNewRecord({ catalogId: this.props.catalogId });
      apiActions.getCatalog({ catalogId: this.props.catalogId });
    } else if (newRecordId && newRecordId !== recordId) {
      apiActions.getRecord({ recordId: newRecordId, catalogId: nextProps.catalogId });
    }
  },

  render() {
    const catalogId = this.props.catalogId;
    const recordId = this.props.recordId == '$new' ? this.props.newRecordId.get(catalogId) : this.props.recordId;

    return (
      <Record
        recordId={recordId}
        catalogId={catalogId}
      />
    );
  }

});

export default connect(RecordController, ['catalogs', 'records', 'newRecordId']);
