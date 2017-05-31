import React from 'react'
import trs from '../../../../../getTranslations'

export default function ({ board, widget, onChange, title }) {
  return (
    <div>
      <input
        type="text"
        className="w100"
        value={widget.get('name')}
        maxLength={255}
        onChange={e => onChange({ name: e.target.value })}
        placeholder={title || trs('reports.widget.modals.common.preview.namePlaceHolder')}
      />
    </div>
  )
}
