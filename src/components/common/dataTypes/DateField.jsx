import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import moment from 'moment'
import {If, Else} from '../ifc'
import {formatDate, formatTime} from '../../../utils/formatDate'

const DateField = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    value: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.string
    ]),
    config: React.PropTypes.object
  },

  render() {
    let date = moment(new Date(this.props.value));

    return (
      <span>
        {this.props.value ?
          <span className="formatted-date">
            {formatDate(date)}&nbsp;
            <If condition={(!!this.props.config.get('time'))}>
              <span className="day-short-text">{formatTime(date)}</span>
              <Else>
                <span className="day-short-text">{date.format('dd').toUpperCase()}</span>
              </Else>
            </If>
          </span>
          : ' '}
      </span>
    );
  }
});

export default DateField;
