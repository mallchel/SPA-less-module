import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import moment from 'moment'
import _ from 'lodash'
import $ from 'jquery'
import cn from 'classnames'
import { DatePicker, TimePicker, Input } from 'antd'

import recordActions from '../../../../../../../../../../actions/recordActions'
// import trs from '../../../../../../../../../../getTranslations'

import styles from './fields.less'

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

const DateField = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    value: React.PropTypes.string,
    error: React.PropTypes.string,
    config: React.PropTypes.object,
    onSave: React.PropTypes.func.isRequired,
    onUpdate: React.PropTypes.func.isRequired,
    readOnly: React.PropTypes.bool,
    catalogId: React.PropTypes.string,
    recordId: React.PropTypes.string,
    fieldId: React.PropTypes.string,
  },

  onChange(picker, val) {
    log('Changed field %s value', this.props.fieldId, val);

    console.log(picker, val)
    val = val !== null ? moment(val).format(API_FORMAT) : val;
    if (val) {
      recordActions.clearErrorField(this.props.catalogId, this.props.recordId, this.props.fieldId);
    }
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
        style={{ width: '125px' }}
        onChange={(val) => this.onChange('date', val)}
      />

    let timeComponent;
    if (withTime) {
      const formattedTimeValue = momentValue.isValid() ? momentValue.format('LT') : value;
      timeComponent = (readOnly) ?
        <Input disabled={true} value={formattedTimeValue} />
        :
        <TimePicker
          defaultValue={value ? moment(value) : null}
          style={{ width: '135px' }}
          className={styles.timePicker}
          format={MOMENT_TIME_FORMAT}
          onChange={(val) => this.onChange('time', val)}
          allowEmpty={false}
        />
    }
    return (
      <div className={cn(styles.dateContainer, !value ? ' record-date--empty' : '')}>
        {dateComponent}
        {timeComponent}
        <span className={styles.fieldInfo}>{
          value
            ? moment(value, API_FORMAT).fromNow()
            : null
        }</span>
      </div>
    );
  }
});

export default DateField;
