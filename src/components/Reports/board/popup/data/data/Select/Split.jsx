import _ from 'lodash';
import BasicSelect from './Basic';

import trs from '../../../../../../../getTranslations';

import * as AXIS_TYPES from '../../../../../../../configs/reports/widget/axisTypes';
import * as AXIS_SUB_TYPES from '../../../../../../../configs/reports/widget/axisSubTypes';
import FIELD_TYPES from '../../../../../../../configs/fieldTypes';

function getDateItems(withTime = false) {
  const types = [
    AXIS_SUB_TYPES.DAY,
    AXIS_SUB_TYPES.DAY_OF_WEEK,
    AXIS_SUB_TYPES.WEEK,
    AXIS_SUB_TYPES.WEEK_OF_YEAR,
    AXIS_SUB_TYPES.MONTH,
    AXIS_SUB_TYPES.MONTH_OF_YEAR,
    AXIS_SUB_TYPES.YEAR
  ];

  if (withTime) {
    types.unshift(
      AXIS_SUB_TYPES.HOUR,
      AXIS_SUB_TYPES.HOUR_OF_DAY
    );
  }

  return types.map(subType => ({
    subType: subType,
    title: `(${trs('reports.widget.modals.common.tabs.data.axis.types.' + subType)})`,
  }));

}

class SelectSplit extends BasicSelect {
  getAvailableValues(fields) {
    return _.compact(_.flatten(fields.toArray().map(field => {
      const fieldId = field.get('id');
      const fieldName = field.get('name');

      switch (field.get('type')) {
        case FIELD_TYPES.DATE:
          return getDateItems(field.getIn(['config', 'time'])).map(({title, subType}) => {
            return {
              type: AXIS_TYPES.FIELD,
              subType,
              title: fieldName + ' ' + title,
              value: fieldId
            };
          });
        case FIELD_TYPES.NUMBER:
        case FIELD_TYPES.TEXT:
        case FIELD_TYPES.DROPDOWN:
        case FIELD_TYPES.CHECKBOXES:
        case FIELD_TYPES.RADIOBUTTON:
        case FIELD_TYPES.STARS:
        case FIELD_TYPES.PROGRESS:
        case FIELD_TYPES.USER:
        case FIELD_TYPES.OBJECT:
          return {
            type: AXIS_TYPES.FIELD,
            value: fieldId,
            title: fieldName
          }
      }
    })))
      .concat(getDateItems(true).map(({title, subType}) => {
        return {
          type: AXIS_TYPES.CREATED,
          subType,
          title: trs('reports.widget.modals.common.tabs.data.axis.types.createdTime') + ' ' + title
        };
      }));
  }
}

export default SelectSplit;
