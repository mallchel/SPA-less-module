import _ from 'lodash';

export default function dataToDatasets(data) {
  const datasets = [];
  const datasetsSplits = [];

  // get all axes
  data.forEach(function ({axis, values}) {
    values.forEach(function ({split, value}) {
      let dataset = _.find(datasetsSplits, ({key})=> _.isEqual(split, key));

      if (!dataset) {
        const chartDataset = {label: split, data: []};
        datasets.push(chartDataset);
        datasetsSplits.push({key: split, chartDataset, split});
      }
    });
  });

  // set values for all axes
  data.forEach(function ({axis, values}, axisIndex) {
    values.forEach(function ({split, value}) {
      let {chartDataset} = _.find(datasetsSplits, ({key})=> _.isEqual(split, key));

      datasets.forEach(_chartDataset=> {
        if (_chartDataset.data[axisIndex] === undefined) {
          _chartDataset.data[axisIndex] = null;
        }
      });

      chartDataset.data[axisIndex] = value;
    });
  });

  // set colors for all axes
  return datasetsSplits;
}
