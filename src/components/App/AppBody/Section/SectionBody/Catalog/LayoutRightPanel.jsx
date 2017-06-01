import React from 'react'
import RecordController from './Record/RecordController'

const LayoutRightPanel = function (props) {
  return (
    <RecordController
      recordId={props && props.match.params.recordId}
      catalogId={props && props.match.params.catalogId}
    />
    /*<Record
      recordId={props && props.match.params.recordId}
      catalogId={props && props.match.params.catalogId}
    />*/
  )
}

export default LayoutRightPanel;
