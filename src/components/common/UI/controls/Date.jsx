import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import moment from 'moment'
import _ from 'lodash'
import { DatePicker, TimePicker, Input } from 'antd'

// import recordActions from '../../../../actions/recordActions'
import trs from '../../../../getTranslations'

import styles from './controls.less'

const log = require('debug')('CRM:Component:Record:DateField');
const API_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ';
const DATA_PICKER_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const MOMENT_DATE_FORMAT = 'DD.MM.YYYY';
const MOMENT_TIME_FORMAT = 'HH:mm';

// const hideWidgetsMixin = {
//   componentDidMount() {
//     let $el = $(this.node);

//     $el.on('show', () => {
//       $el.parents().on('scroll', this.onParentsScroll);
//     });

//     $el.on('hide', () => {
//       $el.parents().off('scroll', this.onParentsScroll);
//     });
//   },

//   componentWillUnmount() {
//     let $el = $(this.node);
//     $el.parents().off('scroll', this.onParentsScroll);
//   }
// };

const DateControl = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    value: React.PropTypes.string,
    error: React.PropTypes.string,
    config: React.PropTypes.object,
    onSave: React.PropTypes.func.isRequired,
    onUpdate: React.PropTypes.func.isRequired,
    readOnly: React.PropTypes.bool,
  },

  onChange(picker, val) {
    log('Changed field %s value', this.props.fieldId, val);

    val = val !== null ? moment(val).format(API_FORMAT) : val;

    this.props.onSave(val);
    this.props.onUpdate(val);
  },

  render() {
    const withTime = this.props.config.get('time');
    const { value, readOnly } = this.props;
    let momentValue = moment(value || '');

    const formattedDateValue = momentValue.isValid() ? momentValue.format('L') : value;
    const dateComponent = readOnly
      ? <Input disabled={true} value={formattedDateValue} />
      :
      <DatePicker
        defaultValue={value ? moment(value) : null}
        format={MOMENT_DATE_FORMAT}
        style={{ width: '100px' }}
        onChange={(val) => this.onChange('date', val)}
        placeholder={trs("fieldTypes.date.name")}
      />

    let timeComponent;
    if (withTime) {
      const formattedTimeValue = momentValue.isValid() ? momentValue.format('LT') : value;
      timeComponent = (readOnly) ?
        <Input disabled={true} value={formattedTimeValue} />
        :
        <TimePicker
          defaultValue={value ? moment(value) : null}
          className={styles.timePicker}
          format={MOMENT_TIME_FORMAT}
          style={{ width: '100px' }}
          onChange={(val) => this.onChange('time', val)}
          allowEmpty={false}
          placeholder={trs("fieldTypes.time.name")}
        />
    }
    return (
      <div className={styles.dateContainer}>
        {dateComponent}
        {timeComponent}
        <span className={styles.subInfo}>{
          value
            ? moment(value, API_FORMAT).fromNow()
            : null
        }</span>
      </div>
    );
  }
});

export default DateControl;
