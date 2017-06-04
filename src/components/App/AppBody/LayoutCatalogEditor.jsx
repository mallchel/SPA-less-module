import React from 'react'
import FieldTypes from '../../fieldTypes/FieldTypes'
import CatalogEditor from '../../catalogEditor/CatalogEditor'

export default function () {
  return (
    <div>
      <div>
        <FieldTypes />
      </div>
      <div>
        <CatalogEditor />
      </div>
    </div>
  )
}
