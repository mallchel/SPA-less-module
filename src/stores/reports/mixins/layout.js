import _ from 'lodash';
import Immutable from 'immutable';

import { XS_WIDTH, XXS_WIDTH, SM_WIDTH, MD_WIDTH } from '../../../configs/reports/colsWidth';
import getCorrectGridLayout from './getCorrectGridLayout';

function zoomLayout(layout, k) {
  return layout.map(({ x, w, ...o }) => {
    return {
      ...o,
      x: x * k,
      w: w * k
    };
  })
}

function correctMinWidth(layout, minWidth = 1) {
  return layout.map(o => {
    return {
      ...o,
      minW: minWidth
    };
  });
}

export function correctGrid({ xs = [], xxs = [], sm = [], md = {} }, widgets) {
  xxs = getCorrectGridLayout(xxs, widgets, XXS_WIDTH);
  xs = getCorrectGridLayout(xs, widgets, XS_WIDTH);
  sm = correctMinWidth(
    getCorrectGridLayout(sm.length ? sm : zoomLayout(xs, SM_WIDTH / 2), widgets, SM_WIDTH),
    2
  );
  md = getCorrectGridLayout(md.length ? md : sm, widgets, MD_WIDTH);

  return {
    xxs, xs, sm, md
  }
}

export function toGrid(layouts, widgets) {
  widgets = widgets || Immutable.List();
  const grid = _.mapValues(layouts, l => _.map(l, function (params, id) {
    const widget = widgets.find(w => w.get('id') === id);
    if (!widget) { return; }
    return { i: widget.get('uid'), ...params };
  }).filter(i => i));

  return correctGrid(grid, widgets);
}

export function fromGrid(grid, widgets) {
  widgets = widgets || Immutable.List();
  return _.mapValues(grid, gl => {
    const gridLayout = {};
    _.forEach(gl, function ({ i, x, y, w, h }) {
      const widget = widgets.find(w => w.get('uid') === i);
      const widgetId = widget && widget.get('id');
      if (!widgetId) { return; }
      gridLayout[widgetId] = { x, y, w, h };
    });
    return gridLayout;
  });
}

export function isEqual(layout1, layout2) {
  return _.isEqual(layout1, layout2);
}
