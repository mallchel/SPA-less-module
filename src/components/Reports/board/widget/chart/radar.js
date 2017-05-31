import _ from 'lodash';
import tinyColor from 'tinycolor2';
import {Radar} from 'react-chartjs-2';

import Base from './base'

class WidgetChartRadar extends Base {
  getChartComponent() {
    return Radar;
  }

  getDatasets() {
    const datasets = super.getDatasets();

    datasets.forEach(({chartDataset})=> {
      for (let i in chartDataset.data) {
        if (chartDataset.data[i] === null) {
          chartDataset.data[i] = 0;
        }
      }
    });

    return datasets;
  }

  getSplitColor(...args) {
    let color = tinyColor(super.getSplitColor(...args));
    color.setAlpha(0.2);
    return color.toRgbString();
  }

  getOptions() {
    const options = super.getOptions();
    options.scale = options.scales[this.valuesAxis + 'Axes'][0];
    options.scale.ticks.beginAtZero = !!this.props.widget.get('stacked');
    options.scales = {};
    options.legend.position = 'right';

    return options;
  }
}

export default WidgetChartRadar;
