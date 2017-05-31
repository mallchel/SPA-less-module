import React from 'react'
import trs from '../../../../../../../getTranslations'

export default function ({ value, onChange }) {
  return (
    <label className="checkbox">
      <input type="checkbox" checked={value} onChange={e => onChange(!!e.target.checked)} />{
        trs('reports.widget.modals.common.tabs.data.split.stacked')
      }
    </label>
  );
}
