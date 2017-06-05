import React from 'react'
import FieldTypes from '../../fieldTypes/FieldTypes'
import CatalogEditor from '../../catalogEditor/CatalogEditor'

export default function (props) {
  return (
    <div>
      <div>
        <FieldTypes />
      </div>
      <div>
        <CatalogEditor {...props} />
      </div>
    </div>
  )
}
