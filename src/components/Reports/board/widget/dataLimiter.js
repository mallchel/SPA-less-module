import * as AXIS_TYPES from '../../../../configs/reports/widget/axisTypes';
import FIELD_TYPES from '../../../../configs/fieldTypes';
import * as CHART_TYPES from '../../../../configs/reports/widget/chartTypes';

export default function mixDataLimter(query, widget, catalog) {
  const type = widget.get('chartType');

  let limit;

  switch (type) {
    case CHART_TYPES.NUMBER:
      limit = 1;
      break;
    case CHART_TYPES.PIE:
    case CHART_TYPES.RADAR:
      const axis = widget.get('axis');
      const fields = catalog.get('fields');

      switch (axis && axis.get('type')) {
        case AXIS_TYPES.FIELD:
          const fieldId = axis.get('value');
          const field = fields && fields.find(f=> f.get('id') === fieldId);
          switch (field && field.get('type')) {
            case FIELD_TYPES.DROPDOWN:
            case FIELD_TYPES.RADIOBUTTON:
            case FIELD_TYPES.CHECKBOXES:
              break;
            default:
              limit = 10;
          }
      }
  }

  if (limit) {
    query.limit = limit;
  }
}
