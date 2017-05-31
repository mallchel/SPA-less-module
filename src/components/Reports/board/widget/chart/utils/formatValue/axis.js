import numeral from 'numeral';

import formatTooltip from './tooltip';

import * as VALUES_TYPES from '../../../../../../../configs/reports/widget/valuesTypes';
import * as VALUES_SUB_TYPES from '../../../../../../../configs/reports/widget/valuesSubTypes';
import FIELD_TYPES from '../../../../../../../configs/fieldTypes';

function getRank(value, values) {
  const diff = Math.abs(values[1] - values[0]);
  const isFloat = Math.floor(diff) !== diff;
  const valueRank = String(Math.abs(value)).length;

  if (isFloat) {
    return valueRank;
  }

  const diffRank = String(diff).length;
  const intPart = valueRank % 3 || 3;
  const importantPart = valueRank - diffRank + 1;
  const floatPart = importantPart - intPart;

  return floatPart > 0 ? floatPart : 0;
}

export default function formatAxisValue({value, values}, valueConfig, fields) {
  switch (valueConfig && valueConfig.get('subType')) {
    case VALUES_SUB_TYPES.TIME_BEFORE:
    case VALUES_SUB_TYPES.TIME_LEFT:
      return formatTooltip(value, valueConfig, fields);
  }

  const rank = getRank(value, values);
  let nulls = ',0.[0]';

  if (rank < String(value).length - 2) {
    nulls = '.[' + (new Array(rank)).fill(0).join('') + ']a';
  }

  return numeral(value).format(`0` + nulls);
}
