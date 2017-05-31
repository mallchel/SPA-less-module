import React from 'react'
import _ from 'lodash'
import { HorizontalBar } from 'react-chartjs-2'

import Base from './base'

import * as AXIS_TYPES from '../../../../../configs/reports/widget/axisTypes'
import * as AXIS_SUB_TYPES from '../../../../../configs/reports/widget/axisSubTypes'
import FIELD_TYPES from '../../../../../configs/fieldTypes'

function WidgetChartBarComponent(props) {
  const { data, options } = props;
  const stacked = _.get(options, 'scales.xAxes[0].stacked') || _.get(options, 'scales.yAxes[0].stacked');
  const axisCount = data.labels.length || 0;
  const splitCount = stacked ? 1 : (data.datasets.length || 1);
  const barHeight = 15 * splitCount + 10;
  const legendHeight = options.legend.display ? 24 * 2 : 0; // 2 rows, todo correct legend height
  const height = barHeight * axisCount + 33 + legendHeight;

  return (
    <div style={{ height, position: 'relative' }}>
      <HorizontalBar {...props} />
    </div>
  );
}

class WidgetChartBar extends Base {
  valuesAxis = 'x';
  labelsAxis = 'y';

  getChartComponent() {
    return WidgetChartBarComponent;
  }

  getReportData() {
    const reportData = super.getReportData();
    if (this.getAxisSortFn()) {
      return reportData;
    }
    return reportData.reverse();
  }

  getDatasets() {
    const datasets = super.getDatasets();

    if (datasets.length === 1) {
      const { widget, fields } = this.props;
      const axisFieldId = widget.getIn(['axis', 'type']) === AXIS_TYPES.FIELD && widget.getIn(['axis', 'value']);
      const axisField = axisFieldId && fields.find(f => f.get('id') === axisFieldId);
      const axisFieldType = axisField && axisField.get('type');

      if (axisFieldType !== FIELD_TYPES.DROPDOWN) {
        return datasets;
      }

      datasets.forEach(({ chartDataset }, index) => {
        const data = this.getReportData();

        const color = data.map(({ axis }) => {
          return this.getAxisColor(axis, index);
        });

        const borderColor = color.map(color => {
          return this.getBorderColor(color);
        });

        _.assign(chartDataset, _.defaultsDeep({
          backgroundColor: color,
          borderColor: borderColor,
          pointBackgroundColor: borderColor,
          dataLabels: {
            colors: color.map(this.getLabelColor)
          }
        }, chartDataset));
      });
    }

    return datasets;
  }

  getOptions() {
    const { widget } = this.props;
    const split = widget.get('split');
    const stacked = widget.get('stacked');

    let barConfig;

    if (stacked || !split) {
      barConfig = {
        categoryPercentage: 0.9,
        barPercentage: 1
      }
    } else {
      barConfig = {
        categoryPercentage: 0.75,
        barPercentage: 1
      }
    }

    return _.defaultsDeep({
      scales: {
        [this.labelsAxis + 'Axes']: [{
          ...barConfig,
          gridLines: {
            display: false
          }
        }],
        [this.valuesAxis + 'Axes']: [{
          position: 'top'
        }]
      }
    }, super.getOptions());
  }
}

import Chart from 'chart.js';
const horizontalBarUpdateElement = Chart.controllers.horizontalBar.prototype.updateElement;

Chart.controllers.horizontalBar.prototype.updateElement = function (rectangle, index, reset) {
  horizontalBarUpdateElement.call(this, rectangle, index, reset);
  const horizontalBarDraw = rectangle.draw;
  rectangle.draw = function () {
    const ctx = this._chart.ctx;
    const vm = this._view;
    const borderSingleWidth = 2;

    const borderWidth = vm.borderWidth;
    vm.borderWidth = 0;
    horizontalBarDraw.call(this);
    vm.borderWidth = borderWidth;

    var halfHeight = vm.height / 2,
      topY = vm.y - halfHeight,
      bottomY = vm.y + halfHeight,
      right = vm.base - (vm.base - vm.x),
      halfStroke = borderSingleWidth / 2;

    // Canvas doesn't allow us to stroke inside the width so we can
    // adjust the sizes to fit if we're setting a stroke on the line
    if (borderSingleWidth) {
      if (vm.x < vm.base) {
        right += halfStroke;
      } else {
        right -= halfStroke;
      }
    }

    ctx.beginPath();

    // top border
    ctx.lineWidth = borderSingleWidth;
    ctx.moveTo(right, topY);
    ctx.lineTo(right, bottomY);
    ctx.stroke();
  };
};

export default WidgetChartBar;
