import numeral from 'numeral';

import duration from './duration';

import * as VALUES_TYPES from '../../../../../../../configs/reports/widget/valuesTypes';
import * as VALUES_SUB_TYPES from '../../../../../../../configs/reports/widget/valuesSubTypes';
import FIELD_TYPES from '../../../../../../../configs/fieldTypes';

export default function formatTooltipValue(value, valueConfig, fields) {
  switch (valueConfig && valueConfig.get('subType')) {
    case VALUES_SUB_TYPES.TIME_BEFORE:
    case VALUES_SUB_TYPES.TIME_LEFT:
      return duration(value);
  }
  return numeral(value).format('0,0.[0]');
}
