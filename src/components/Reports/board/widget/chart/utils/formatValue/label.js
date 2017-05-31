import numeral from 'numeral'

import formatTooltip from './tooltip';

import * as VALUES_TYPES from '../../../../../../../configs/reports/widget/valuesTypes';
import * as VALUES_SUB_TYPES from '../../../../../../../configs/reports/widget/valuesSubTypes';
import FIELD_TYPES from '../../../../../../../configs/fieldTypes';

export default function formatAxisValue({value, values}, valueConfig, fields) {
  switch (valueConfig && valueConfig.get('subType')) {
    case VALUES_SUB_TYPES.TIME_BEFORE:
    case VALUES_SUB_TYPES.TIME_LEFT:
      return formatTooltip(value, valueConfig, fields);
  }

  return numeral(value).format(`0[.]0a`);
}
