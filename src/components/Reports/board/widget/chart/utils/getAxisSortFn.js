import * as AXIS_TYPES from '../../../../../../configs/reports/widget/axisTypes';
import * as AXIS_SUB_TYPES from '../../../../../../configs/reports/widget/axisSubTypes';
import FIELD_TYPES from '../../../../../../configs/fieldTypes';

export default function getAxisSortFn(axisConfig, fields) {
  switch (axisConfig && axisConfig.get('type')) {
    case AXIS_TYPES.FIELD:
      const field = fields.find(f=> f.get('id') === axisConfig.get('value'));
      const fieldType = field && field.get('type');

      switch (fieldType) {
        case FIELD_TYPES.DROPDOWN:
        case FIELD_TYPES.CHECKBOXES:
        case FIELD_TYPES.RADIOBUTTON:
          const fieldConfig = field.get('config');
          const items = fieldConfig && fieldConfig.get('items') || [];
          return function (axis1, axis2) {
            const axis1Index = items.findIndex(i=> i.get('id') == axis1);

            if (axis1Index === -1) {
              return Infinity;
            }

            const axis2Index = items.findIndex(i=> i.get('id') == axis2);

            if (axis2Index === -1) {
              return -1;
            }

            return axis1Index - axis2Index;
          }
      }
  }
}
