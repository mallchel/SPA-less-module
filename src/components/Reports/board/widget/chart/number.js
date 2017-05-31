import _ from 'lodash';
import numeral from 'numeral';
import React, {Component} from 'react';
import {NotifyResize} from 'react-notify-resize'
import {Line} from 'react-chartjs-2';
import tinyColor from 'tinycolor2';

import formatAxis from './utils/formatAxis';
import formatValue from './utils/formatValue/tooltip';
import {getRealColor} from './utils/getAxisColor';

function getValueSize(width, height) {
  return Math.floor(Math.min(
    width / 10,
    height  / 3
  ));
}

function getLabelSize(width, height) {
  return Math.max(
    Math.floor(getValueSize(width, height) / 3),
    11
  )
}

export default class WidgetChartNumber extends Component {
  state = {valueSize: 0, labelSize: 0};

  onResize({width, height}) {
    this.setState({
      valueSize: getValueSize(width, height),
      labelSize: getLabelSize(width, height)
    });
  }

  render() {
    const {chartData, widget, fields} = this.props;
    const row = _.first(chartData);

    if (!row) {
      return <div>Empty data</div>
    }

    const {axis, values} = row;
    const totalValue = _.reduce(values, (sum, {value})=> {
      return sum + value;
    }, 0);

    const formattedValue = formatValue(totalValue, widget.get('value'), fields);
    const formattedAxis = formatAxis(axis, widget.get('axis'), fields);

    const valueStyle = {fontSize: this.state.valueSize + 'px'};
    const labelStyle = {fontSize: this.state.labelSize + 'px'};

    const color = getRealColor(axis, widget.get('axis'), fields);
    if (color) {
      valueStyle.color = labelStyle.color = tinyColor(color)
        .darken(25)
        .desaturate(15)
        .toHexString();
    }

    return (
      <div className="widget-number">
        <NotifyResize notifyOnMount={true} onResize={this.onResize.bind(this)}/>
        <div className="widget-number__content">
          <div className="widget-number__value" style={valueStyle}>{formattedValue}</div>
          <div className="widget-number__label" style={labelStyle}>{formattedAxis}</div>
        </div>
      </div>
    );
  }
}
