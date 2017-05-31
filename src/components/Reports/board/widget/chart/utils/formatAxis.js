import moment from 'moment';
import truncate from 'lodash.truncate';

import trs from '../../../../../../getTranslations';
import {formatDate} from '../../../../../../utils/formatDate';

import * as AXIS_TYPES from '../../../../../../configs/reports/widget/axisTypes';
import * as AXIS_SUB_TYPES from '../../../../../../configs/reports/widget/axisSubTypes';
import FIELD_TYPES from '../../../../../../configs/fieldTypes';

const CURRENT_YEAR = moment().year();

function _formatDate(axis, config) {
  if (axis === null) {
    return null;
  }
  switch (config.get('subType')) {
    case AXIS_SUB_TYPES.DAY_OF_WEEK:
      // axis == 1 - is sunday
      return moment.weekdaysShort(axis - moment().localeData().firstDayOfWeek()) || `{day: ${axis}}`;
    case AXIS_SUB_TYPES.MONTH:
      const date = moment(new Date(axis + '-01'));
      if (date.isValid()) {
        if (date.year() === CURRENT_YEAR) {
          return date.format('MMM');
        } else {
          return date.format('MMM YY');
        }
      }
      return `{month: ${axis}}`;
    case AXIS_SUB_TYPES.MONTH_OF_YEAR:
      return moment.monthsShort(axis - 1) || `{month: ${axis}}`;
    case AXIS_SUB_TYPES.DAY:
    case AXIS_SUB_TYPES.WEEK:
      return axis && formatDate(axis);
    case AXIS_SUB_TYPES.HOUR:
      return axis && formatDate(axis, true);
  }

  return axis;
}

function _formatAxis(axis, config, fields) {
  switch (config.get('type')) {
    case AXIS_TYPES.FIELD:
      const field = fields.find(f=> f.get('id') === config.get('value'));
      const fieldType = field && field.get('type');
      const emptyValue = trs('reports.widget.modals.common.tabs.data.axis.emptyValue');

      switch (fieldType) {
        case FIELD_TYPES.USER:
          return axis && axis.title || emptyValue;
        case FIELD_TYPES.OBJECT:
          return axis && axis.recordTitle || emptyValue;
        case FIELD_TYPES.CHECKBOXES:
        case FIELD_TYPES.RADIOBUTTON:
        case FIELD_TYPES.DROPDOWN:
          if (axis === null) {
            return emptyValue;
          }
          const fieldItems = field.getIn(['config', 'items']) || [];
          const fieldItem = fieldItems.find(i=> i.get('id') == axis);
          return fieldItem && fieldItem.get('name') || `{code: ${axis}}`;
        case FIELD_TYPES.DATE:
          return _formatDate(axis, config) || emptyValue;
      }

      break;

    case AXIS_TYPES.CREATED:
      return _formatDate(axis, config);
      break;
  }

  return axis;
}

export default function formatAxis(...args) {
  return truncate(_formatAxis(...args), {length: 20, omission: '\u2026'});
}
