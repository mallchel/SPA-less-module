import * as AXIS_TYPES from '../../../../configs/reports/widget/axisTypes';
import FIELD_TYPES from '../../../../configs/fieldTypes';

export default function mixDataSorting(query, widget, catalog) {
  const axis = widget.get('axis');
  const fields = catalog.get('fields');

  switch (axis && axis.get('type')) {
    case AXIS_TYPES.FIELD:
      const fieldId = axis.get('value');
      const field = fields && fields.find(f=> f.get('id') === fieldId);
      switch (field && field.get('type')) {
        case FIELD_TYPES.OBJECT:
        case FIELD_TYPES.USER:
          query.order = 'value'
      }
  }
}
