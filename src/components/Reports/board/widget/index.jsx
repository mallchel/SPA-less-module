import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Immutable from 'immutable';
import VisibilitySensor from 'react-visibility-sensor';

import './fix-react-chartjs-2';

import trs from '../../../../getTranslations';
import Loading from '../../../common/Loading';

import Chart from './chart';
import Header from './header';
import getDataMixin from './getDataMixin';

function WidgetChartZone(props) {
  const { widget, chartDataObj, license } = props;
  const loading = chartDataObj.get('loading');
  const chartData = chartDataObj.get('data');
  const error = chartDataObj.get('error');
  const inEditMode = widget.get('inEditMode');

  const axis = widget.get('axis');
  const type = widget.get('chartType');
  const classes = 'widget__chart widget__chart--' + type + '';

  if (!license && !inEditMode) {
    return (
      <div className={classes + ' widget__chart--info'}>
        <center>{trs('reports.widget.common.messages.noLicense')}</center>
      </div>
    )
  }

  if (!axis) {
    return (
      <div className={classes + ' widget__chart--info'}>
        <center>{trs('reports.widget.common.messages.axisNotSet')}</center>
      </div>
    )
  }

  const loadingNode = !loading ? null : (
    <div className="widget__loading">
      <Loading text="" />
    </div>
  );

  const initial = loading === undefined;

  const chartNode = chartData && chartData.length
    ? <Chart {...props} chartData={chartData} />
    : !initial && !loading && (
      <div className={classes + ' widget__chart--info'}>
        <center>{trs('reports.widget.common.messages.' + (error ? 'error' : 'noData'))}</center>
      </div>
    );

  return (
    <div className={classes}>
      {loadingNode}
      {chartNode}
    </div>
  );
}

const Widget = React.createClass({
  mixins: [PureRenderMixin, getDataMixin],

  propTypes: {
    widget: ImmutablePropTypes.contains({
      id: React.PropTypes.string
    }).isRequired,
    catalog: ImmutablePropTypes.map.isRequired
  },

  render() {
    const { widget, catalog, board, onChange, readonly, moving, license, editable } = this.props;
    const totalsDataObj = catalog.getIn(['widgetsChartData', widget.get('uid'), 'totals'], Immutable.Map());
    const chartDataObj = catalog.getIn(['widgetsChartData', widget.get('uid'), 'values'], Immutable.Map());

    const totalsData = totalsDataObj.get('data');

    const fields = catalog.get('fields');

    return (
      <VisibilitySensor partialVisibility={true} onChange={isVisible => this.setVisible(isVisible)}>
        <div className='widget'>
          <div className='widget__header'><Header {...{ catalog, widget, fields, board, onChange, readonly, totalsData, moving, license, editable }} /></div>
          <WidgetChartZone {...{ widget, chartDataObj, fields, license }} />
        </div>
      </VisibilitySensor>
    );
  }
});

export default Widget;
