import _ from 'lodash';
import {Pie} from 'react-chartjs-2';
import tinyColor from 'tinycolor2';

import Base from './base'

class WidgetChartPie extends Base {
  getChartComponent() {
    return Pie;
  }

  getAxisColor(...args) {
    const color = tinyColor(super.getAxisColor(...args));
    return color.setAlpha(1).toRgbString();
  }

  getDatasets() {
    const datasets = super.getDatasets();

    datasets.forEach(({chartDataset})=> {
      const data = this.getReportData();

      const color = data.map(({axis}, index)=> {
        return this.getAxisColor(axis, index);
      });

      const labelColors = color.map(this.getLabelColor);

      // return default format fn
      delete chartDataset.dataLabels.format;

      _.assign(chartDataset, _.defaultsDeep({
        backgroundColor: color,
        borderColor: '#fff',
        dataLabels: {
          colors: labelColors
        }
      }, chartDataset));
    });

    return datasets;
  }

  getOptions() {
    const options = super.getOptions();
    options.scales = {};
    options.legend.display = true;
    options.legend.position = 'right';

    return options;
  }
}

export default WidgetChartPie;
