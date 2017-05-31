import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import moment from 'moment'
import _ from 'lodash'
import $ from 'jquery'
import { DatePicker } from 'antd'

import recordActions from '../../../../../../../../../../actions/recordActions'
import trs from '../../../../../../../../../../getTranslations'

const log = require('debug')('CRM:Component:Record:DateField');
const API_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ';
const DATA_PICKER_FORMAT = 'YYYY-MM-DD HH:mm:ss';

const hideWidgetsMixin = {
  componentDidMount() {
    let $el = $(this.node);

    $el.on('show', () => {
      $el.parents().on('scroll', this.onParentsScroll);
    });

    $el.on('hide', () => {
      $el.parents().off('scroll', this.onParentsScroll);
    });
  },

  componentWillUnmount() {
    let $el = $(this.node);
    $el.parents().off('scroll', this.onParentsScroll);
  }
};

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

  onChange(val) {
    log('Changed field %s value', this.props.fieldId, val);

    val = val || null;

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
      ? <input readOnly={true} className="record-date__date" type="text" value={formattedDateValue} />
      : <DatePicker
        showTime={withTime}
        defaultValue={value ? moment(value, API_FORMAT) : null}
        format={DATA_PICKER_FORMAT}
      />

    return (
      <div className={'record-date' + (!value ? ' record-date--empty' : '')}>
        {dateComponent}
        <span className="record-date__info">{
          value
            ? moment(value, API_FORMAT).fromNow()
            : null
        }</span>
      </div>
    );
  }
});

export default DateField;
