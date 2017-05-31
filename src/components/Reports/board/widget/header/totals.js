import React from 'react';
import numeral from 'numeral';

import formatTooltipValue from '../chart/utils/formatValue/tooltip';
import trs from '../../../../../getTranslations';

export default function ({data, widget, className}) {
  if (!data) {
    // https://github.com/facebook/react/issues/5355
    return <noscript/>;
  }

  return (
    <div className={className + " widget-totals"}>
      <div className="widget-totals__sum widget-total">
        <div className="widget-total__value">
          <strong>{formatTooltipValue(data.sum, widget.get('value'))}</strong>
        </div>
        <div className="widget-total__label">
          <small>{trs('reports.widget.modals.common.totals.sum')}</small>
        </div>
      </div>
      <div className="widget-totals__avg widget-total">
        <div className="widget-total__value">
          {formatTooltipValue(data.avg, widget.get('value'))}
        </div>
        <div className="widget-total__label">
          <small>{trs('reports.widget.modals.common.totals.avg')}</small>
        </div>
      </div>
    </div>
  )
}
