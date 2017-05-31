import _ from 'lodash';

import React, {Component} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import 'chartsjs-plugin-data-labels';

import formatAxis from './utils/formatAxis';
import convertDataToDatasets from './utils/convertDataToDatasets';
import getAxisColor from './utils/getAxisColor';
import getBorderColor from './utils/getBorderColor';
import getLabelColor from './utils/getLabelColor';
import formatAxisValue from './utils/formatValue/axis';
import formatTooltipValue from './utils/formatValue/tooltip';
import formatLabelValue from './utils/formatValue/label';
import getAxisSortFn from './utils/getAxisSortFn';

class BaseChartJS extends Component {
  shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  state = {
    redraw: false
  };
  valuesAxis = 'y';
  labelsAxis = 'x';

  componentWillReceiveProps(nextProps) {
    const prevSplit = this.props.widget.get('split');
    const newSplit = nextProps.widget.get('split');
    const splitIsEqual = !prevSplit && !newSplit || (prevSplit && prevSplit.equals(newSplit));

    const prevStacked = this.props.widget.get('stacked');
    const newStacked = nextProps.widget.get('stacked');
    const stackedIsEqual = prevStacked == newStacked;

    this.setState({
      redraw: !splitIsEqual // else legend not shown
      || !stackedIsEqual // else stacked not apply
    });
  }

  getOptions() {
    const {widget} = this.props;
    const split = widget.get('split');
    const stacked = !!widget.get('stacked');

    return {
      legend: {
        display: !!split,
        position: 'bottom',
        labels: {
          boxWidth: 12
        }
      },
      maintainAspectRatio: false,
      tooltips: {
        mode: 'index',
        callbacks: {
          label: (item, data)=> {
            return this.formatTooltipLabelItem(item, data);
          }
        }
      },
      scales: {
        [this.labelsAxis + 'Axes']: [{
          stacked,
          ticks: {
            maxRotation: 0
          }
        }],
        [this.valuesAxis + 'Axes']: [{
          stacked,
          ticks: {
            maxRotation: 0,
            callback: (value, index, values)=> {
              return this.formatAxisValue(value, index, values);
            }
          }
        }]
      },
      animation: {
        duration: 0
      }
    }
  }

  _formatAxis(axis, config) {
    const fields = this.props.fields;
    return formatAxis(axis, config, fields)
  }

  formatAxis(axis) {
    const config = this.props.widget.get('axis');
    return this._formatAxis(axis, config)
  }

  formatAxisValue(value, index, values) {
    return formatAxisValue({value, index, values}, this.props.widget.get('value'), this.props.fields);
  }

  formatTooltipValue(value) {
    return ' ' + formatTooltipValue(value, this.props.widget.get('value'), this.props.fields);
  }

  formatLabelValue(value, {_datasetIndex}, datasets) {
    const values = _.get(datasets, [_datasetIndex, 'data']) || [] ;
    return formatLabelValue({value, values: values}, this.props.widget.get('value'), this.props.fields);
  }

  formatTooltipLabelItem({datasetIndex, index}, data) {
    const value = _.get(data, ['datasets', datasetIndex, 'data', index]);
    return this.formatTooltipValue(value);
  }

  formatSplit(split) {
    const config = this.props.widget.get('split');
    if (!config) {
      return split;
    }
    return this._formatAxis(split, config)
  }

  _getAxisColor(axis, index, config) {
    const fields = this.props.fields;
    return getAxisColor(axis, index, config, fields)
  }

  getAxisColor(axis, index) {
    const config = this.props.widget.get('axis');
    return this._getAxisColor(axis, index, config)
  }

  getSplitColor(split, index) {
    const config = this.props.widget.get('split');
    return this._getAxisColor(split, index, config)
  }

  getBorderColor(color) {
    return getBorderColor(color);
  }

  getLabelColor(color) {
    return getLabelColor(color);
  }

  getAxisSortFn(){
    const {widget, fields} = this.props;
    return getAxisSortFn(widget.get('axis'), fields);
  }

  getSplitSortFn(){
    const {widget, fields} = this.props;
    return getAxisSortFn(widget.get('split'), fields);
  }

  getReportData() {
    const {chartData} = this.props;
    const sortFn = this.getAxisSortFn();
    if (sortFn) {
      return chartData.sort(function (item1, item2) {
        return sortFn(item1.axis, item2.axis);
      });
    }
    return [...chartData].reverse();
  }

  getLabels() {
    return this.getReportData().map(({axis})=> this.formatAxis(axis))
  }

  datasetsDefaultSortFn(split1, split2) {
    return String(split1) > String(split2) ? 1 : -1;
  }

  getDatasetsSortFn() {
    const sortFn = this.getSplitSortFn() || this.datasetsDefaultSortFn;
    return function (dataset1, dataset2) {
      return sortFn(dataset1.split, dataset2.split);
    };
  }

  getDatasets() {
    const {widget} = this.props;
    const reportData = this.getReportData();
    const datasets = convertDataToDatasets(reportData).sort(this.getDatasetsSortFn());

    datasets.forEach((dataset, index)=> {
      const {split, chartDataset} = dataset;
      const color = this.getSplitColor(split, index);
      const borderColor = this.getBorderColor(color);
      const labelColor = this.getLabelColor(color);

      _.assign(chartDataset, {
        label: this.formatSplit(split),
        borderWidth: 1.5,
        backgroundColor: color,
        borderColor: borderColor,
        pointBackgroundColor: borderColor,
        spanGaps: false,
        dataLabels: {
          color: labelColor,
          format: (v, p)=> this.formatLabelValue(v, p, datasets)
          // display: widget.get('labels')
        }
      })
    });

    return datasets;
  }

  getDatasetForCharts() {
    return this.getDatasets().map(({chartDataset})=> {
      return chartDataset;
    })
  }

  getData() {
    return {
      labels: this.getLabels(),
      datasets: this.getDatasetForCharts()
    }
  }

  // need define
  getChartComponent() {

  }

  render() {
    const ChartComponent = this.getChartComponent();

    const options = this.getOptions();
    const data = this.getData();
    const redraw = this.state.redraw;

    return (
      <ChartComponent {...{data, options, redraw}}/>
    )
  }
}

export default BaseChartJS;
