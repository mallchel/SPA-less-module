import React from 'react'
import Record from './Record'

const LayoutRightPanel = function (props) {
  return (
    <Record
      recordId={props && props.match.params.recordId}
      catalogId={props && props.match.params.catalogId}
    />
  )
}

export default LayoutRightPanel;
