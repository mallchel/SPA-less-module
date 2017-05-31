import React from 'react';
import cn from 'classnames';

import Editable from './editable';
import View from './view';
import Totals from './totals';
import getEmptyName from './getEmptyName';

export default function WidgetHeader(props) {
  console.log(props)
  const { widget, fields, totalsData, readonly, moving } = props;
  const inEditMode = widget.get('inEditMode');
  const HeaderTitle = inEditMode ? Editable : View;

  const title = widget.get('name') || getEmptyName(widget, fields);

  return (
    <div className={cn('widget-header', { 'widget-header--draggable': !readonly && !inEditMode })}>
      <div className="widget-header__title">
        <HeaderTitle {...props} title={title} />
      </div>
      <Totals data={totalsData} widget={widget} className='widget-header__totals' />
    </div>
  )
}
