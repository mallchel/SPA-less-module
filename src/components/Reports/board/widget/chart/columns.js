import _ from 'lodash';
import {Bar} from 'react-chartjs-2';

import * as AXIS_TYPES from '../../../../../configs/reports/widget/axisTypes';
import * as AXIS_SUB_TYPES from '../../../../../configs/reports/widget/axisSubTypes';
import FIELD_TYPES from '../../../../../configs/fieldTypes';
import Base from './base'

class WidgetChartBar extends Base {
  getChartComponent() {
    return Bar;
  }

  getDatasets() {
    const datasets = super.getDatasets();

    if (datasets.length === 1) {
      const {widget, fields} = this.props;
      const axisFieldId = widget.getIn(['axis', 'type']) === AXIS_TYPES.FIELD && widget.getIn(['axis', 'value']);
      const axisField = axisFieldId && fields.find(f=> f.get('id') === axisFieldId);
      const axisFieldType = axisField && axisField.get('type');

      if (axisFieldType !== FIELD_TYPES.DROPDOWN) {
        return datasets;
      }

      datasets.forEach(({chartDataset}, index)=> {
        const data = this.getReportData();

        const color = data.map(({axis})=> {
          return this.getAxisColor(axis, index);
        });

        const borderColor = color.map(color=> {
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
    const {widget} = this.props;
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
        xAxes: [{
          ...barConfig,
          stacked,
          gridLines: {
            display: false
          }
        }],
        yAxes: [{
          stacked
        }]
      }
    }, super.getOptions())
  }
}

import Chart from 'chart.js';
const draw = Chart.elements.Rectangle.prototype.draw;

Chart.elements.Rectangle.prototype.draw = function() {
  const ctx = this._chart.ctx;
  const vm = this._view;
  const borderSingleWidth = 2;

  const borderWidth = vm.borderWidth;
  vm.borderWidth = 0;
  draw.call(this);
  vm.borderWidth = borderWidth;

  let halfWidth = vm.width / 2,
    leftX = vm.x - halfWidth,
    rightX = vm.x + halfWidth,
    top = vm.base - (vm.base - vm.y),
    halfStroke = borderSingleWidth / 2;

  // Canvas doesn't allow us to stroke inside the width so we can
  // adjust the sizes to fit if we're setting a stroke on the line
  if (borderSingleWidth) {
    if (vm.y < vm.base) {
      top += halfStroke;
    } else {
      top -= halfStroke;
    }
  }

  ctx.beginPath();

  // top border
  ctx.lineWidth = borderSingleWidth;
  ctx.moveTo(leftX, top);
  ctx.lineTo(rightX, top);
  ctx.stroke();
};

export default WidgetChartBar;
