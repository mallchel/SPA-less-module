import tinyColor from 'tinycolor2';

import CHARTS_COLORS from '../../../../../../configs/chartsColors';
import * as AXIS_TYPES from '../../../../../../configs/reports/widget/axisTypes';
import * as AXIS_SUB_TYPES from '../../../../../../configs/reports/widget/axisSubTypes';
import FIELD_TYPES from '../../../../../../configs/fieldTypes';

const COLORS = CHARTS_COLORS;
const COLORS_COUNT = COLORS.length;

function getRandomColor(index) {
  let color = '#' + COLORS[index % COLORS_COUNT];
  if (index >= COLORS_COUNT) {
    color = tinyColor(color).darken(Math.floor(index / COLORS_COUNT) * 6).toHexString();
  }
  return color;
}

export function getRealColor(axis, config, fields) {
  switch (config && config.get('type')) {
    case AXIS_TYPES.FIELD:
      const field = fields.find(f=> f.get('id') === config.get('value'));
      const fieldType = field && field.get('type');

      switch (fieldType) {
        case FIELD_TYPES.DROPDOWN:
          const fieldItems = field.getIn(['config', 'items']) || [];
          const fieldItem = fieldItems.find(i=> i.get('id') == axis);
          const color = fieldItem && fieldItem.get('color');
          if (color) {
            return '#' + color;
          }
      }
  }
}

export default function getAxisColor(axis, axisNumber, config, fields) {
  const color = tinyColor(getRealColor(axis, config, fields) || getRandomColor(axisNumber));
  color.setAlpha(0.66).darken(8);
  return color.toRgbString();
}
