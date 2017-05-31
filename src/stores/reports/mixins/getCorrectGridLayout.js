import _ from 'lodash';

import getDefaultSize from './widget/getDefaultSize';

import { ADD_WIDGET } from '../../../configs/reports/widget/types';

function checkZone(matrix, { x, y }, { w, h }) {
  for (let j = 0, posY; j < h; j++) {
    posY = y + j;
    for (let i = 0, posX; i < w; i++) {
      posX = x + i;
      if (_.get(matrix, [posY, posX])) {
        return false;
      }
    }
  }

  return true;
}

function findHole(currentLayout, size, maxWidth) {
  const matrix = [];

  // fill busy cells
  currentLayout.forEach(function ({ x, y, w, h }) {
    for (let j = 0, posY; j < h; j++) {
      posY = y + j;
      if (!matrix[posY]) {
        matrix[posY] = []
      }

      for (let i = 0, posX; i < w; i++) {
        posX = x + i;
        matrix[posY][posX] = true;
      }
    }
  });

  // find empty cell
  // y <= matrix.length to find empty cell if all cells is filled
  for (let y = 0; y <= matrix.length; y++) {
    for (let x = 0; x < maxWidth; x++) {
      if (checkZone(matrix, { x, y }, size)) {
        return { x, y };
      }
    }
  }

  return { x: 0, y: Infinity };
}

export default function (layout, widgets, maxWidth = 2) {
  let newLayout = _.filter(layout, item => item.i !== ADD_WIDGET);

  widgets.forEach(function (widget) {
    const widgetUId = widget.get('uid');
    const inLayout = _.find(newLayout, { i: widgetUId });

    if (!inLayout) {
      const defaultSize = getDefaultSize(widget, maxWidth);

      newLayout.push({
        i: widgetUId,
        ...defaultSize,
        ...findHole(newLayout, defaultSize, maxWidth)
      });
    }
  });

  // newLayout.push({
  //   i: 'addWidget',
  //   w: 1, h: 1,
  //   ...findHole(newLayout, {w: 1, h: 1}, maxWidth)
  // });

  return newLayout;
}
