import React from 'react'
import cn from 'classnames'

import EditWidgetPopup from '../../popup/edit'
import { base } from '../../../../common/Modal'
import trs from '../../../../../getTranslations'

function openEditModal(catalog, board, widget, license) {
  base(EditWidgetPopup, { catalog, board, widget, license })
}

function onClick(e, catalog, board, widget, readonly, license) {
  stopPropogate(e);
  !readonly && openEditModal(catalog, board, widget, license);
}

function stopPropogate(e) {
  e.stopPropagation();
}

export default function ({ catalog, board, widget, readonly, moving, title, license, editable }) {
  return (
    <div className="widget-view-title">
      <span
        className={cn('widget-view-title__text', { 'widget-view-title__text--clickable': !readonly && editable })}
        onClick={e => onClick(e, catalog, board, widget, readonly || !editable, license)}
        onTouchStart={stopPropogate}
        onMouseDown={stopPropogate}
        onDrag={stopPropogate}>{title || trs('reports.widget.noName')}
      </span>
    </div>
  )
}
