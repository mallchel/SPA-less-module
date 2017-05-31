import _ from 'lodash';
import {Line} from 'react-chartjs-2';

import Base from './base'

class WidgetChartLine extends Base {
  getChartComponent() {
    return Line;
  }

  getDatasets() {
    const datasets = super.getDatasets();
    const {widget} = this.props;
    const stacked = widget.get('stacked');

    datasets.forEach(({chartDataset})=> {
      for (let i in chartDataset.data) {
        if (chartDataset.data[i] === null) {
          chartDataset.data[i] = 0;
        }
      }

      _.assign(chartDataset, {
        pointRadius: 1.5,
        pointHitRadius: 10,
        fill: datasets.length === 1 || !!stacked
      });
    });

    return datasets;
  }

  getOptions() {
    const {widget} = this.props;
    const stacked = widget.get('stacked');

    return _.defaultsDeep({
      scales: {
        [this.valuesAxis + 'Axes']: [{
          stacked
        }],
        [this.labelsAxis + 'Axes']: [{
          gridLines: {
            display: false
          }
        }]
      }
    }, super.getOptions())
  }
}

export default WidgetChartLine;
