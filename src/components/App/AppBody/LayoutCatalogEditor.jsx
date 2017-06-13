import React from 'react'
import FieldTypes from '../../fieldTypes/FieldTypes'
import CatalogEditor from '../../catalogEditor/CatalogEditor'
import CatalogEditorHeader from '../../catalogEditor/CatalogEditorHeader'
import styles from './appBody.less'

export default function LayoutCatalogEditor(props) {
  return (
    <div className={styles.layoutCatalogEditor} >
      <CatalogEditorHeader {...props} />
      <div className={styles.bodyCatalogEditor}>
        <FieldTypes />
        <CatalogEditor {...props} />
      </div>
    </div>
  )
}
