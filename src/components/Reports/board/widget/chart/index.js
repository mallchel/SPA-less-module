import _ from 'lodash'
import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

import Lines from './lines'
import Columns from './columns'
import Bars from './bars'
import Number from './number'
import Pie from './pie'
import Radar from './radar'

import * as CHART_TYPES from '../../../../../configs/reports/widget/chartTypes'

const charts = {
  [CHART_TYPES.LINES]: Lines,
  [CHART_TYPES.COLUMNS]: Columns,
  [CHART_TYPES.BARS]: Bars,
  [CHART_TYPES.NUMBER]: Number,
  [CHART_TYPES.PIE]: Pie,
  [CHART_TYPES.RADAR]: Radar
};

const WidgetChart = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {},

  render() {
    const { widget, chartData } = this.props;

    const id = widget.get('id');
    const chartType = widget.getIn(['chartType']);

    const Chart = charts[chartType];

    return Chart
      ? <Chart {...this.props} />
      : <div>Widget "{id}" chart type "{chartType}" data: {chartData && JSON.stringify(chartData)}</div>;
  }
});

export default WidgetChart;
