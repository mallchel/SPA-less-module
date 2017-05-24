import _ from 'lodash'
import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import ReactDOM from 'react-dom'
import moment from 'moment'
import $ from 'jquery'
import Immutable from 'immutable'

import trs from '../../../../../../../../../getTranslations'
import AppState from '../../../../../../../../../appState'

import DebouncedInput from '../../../../../../../../common/DebouncedInput'

const log = require('debug')('CRM:Component:Filter:DateField');
const MOMENT_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ';
const MOMENT_TIME_FORMAT = 'HH:mm';
const MOMENT_DATE_FORMAT = 'DD.MM.YYYY';
const DAY = 'day';

const DateField = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    value: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.string
    ]),
    onSave: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      value: this.props.value ? moment(new Date(this.props.value)).format(MOMENT_FORMAT) : undefined
    };
  },

  hideWidgets() {
    $(ReactDOM.findDOMNode(this.refs.date)).blur();
    let timeEl = this.refs.time && $(ReactDOM.findDOMNode(this.refs.time));
    if (timeEl) {
      timeEl.timepicker('hideWidget');
    }
  },

  setValues(value = this.state.value) {
    let cd = value ? new Date(value) : null;
    //log('setValues', value, this.state.value);

    if (cd) {
      $(ReactDOM.findDOMNode(this.refs.date)).datepicker('setValue', cd);
    }
  },

  onChangeTime(e) {
    // log(e.target.value);
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value &&
      ( !this.props.value || moment(new Date(this.props.value)).format(MOMENT_FORMAT) === this.state.value )) {
      this.setState({
        value: nextProps.value || ''
      });
      this.setValues(nextProps.value);
    }
  },

  componentDidMount() {
    let dateEl = $(ReactDOM.findDOMNode(this.refs.date));

    dateEl.datepicker({format: 'dd.mm.yyyy'});

    dateEl.on('change changeDate', (e)=> {
      let val = dateEl.val().trim();

      if (!_.isEmpty(val)) {
        let d = moment(val, MOMENT_DATE_FORMAT);
        if (/^([0-2][0-9]|3[0-1])\.(1[0-2]|0[0-9])\.(1|2)[0-9]{3}$/.test(val) && d.format() !== 'Invalid date') {
          // log('date valid');
          let cd = moment(new Date(this.state.value));
          this.setState({
            value: moment(val + cd.format(MOMENT_TIME_FORMAT), MOMENT_DATE_FORMAT + MOMENT_TIME_FORMAT).format(MOMENT_FORMAT)
          });
        } else {
          // log('date invalid');
          setTimeout(()=> {
            if (this.state.value) {
              dateEl.datepicker('setValue', new Date(this.state.value));
            }
          });
        }
      } else {
        this.setState({
          value: undefined
        })
      }
      // log('date change', val);

    });

    this.setValues();

    dateEl.parents('.record-tab-container').on('scroll', this.hideWidgets);
  },

  componentWillUnmount() {
    let el = $(ReactDOM.findDOMNode(this.refs.date));
    el.off();
    el.datepicker('destroy');

    log('destroy');

    let timeEl = this.refs.time && $(ReactDOM.findDOMNode(this.refs.time));
    if (timeEl) {
      timeEl.timepicker('destroy');
      timeEl.off();
    }

    el.parents('.record-tab-container').off('scroll', this.hideWidgets);
  },

  prepareValue(value) {
    this.props.onSave(value || null);
  },

  componentDidUpdate(prevProps, prevState) {
    // log('cdu', this.state.value)
    if (prevProps.value === this.props.value && prevState.value !== this.state.value) {
      this.prepareValue(this.state.value);
    }
    if (prevState.value !== this.state.value) {
      // this.setValues(this.state.value);
    }
  },

  render() {
    return (
      <span className={'record-date' + (!this.state.value ? ' record-date--empty' : '')}>
        <input className="record-date__date" ref="date" type="text" placeholder={this.props.placeholder}/>
      </span>
    );
  }
});

const FIXED = 'fixed';
const RELATIVE = 'relative';

function isNumber(value) {
  return /^\-?\d*$/.test(value);
}

function isEqual(value1, value2) {
  // normalize
  value1 = Immutable.fromJS(value1);
  value2 = Immutable.fromJS(value2);

  return Immutable.is(value1, value2);
}

const DateRangeField = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    value: React.PropTypes.any,
    onSave: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      keyRange: (typeof this.props.value === 'string') ? this.props.value : FIXED
    }
  },

  componentWillReceiveProps(nextProps) {
    if (isEqual(this.currentValue, nextProps.value)) {
      return;
    }

    if ((typeof nextProps.value === 'string')) {
      this.setState({
        keyRange: nextProps.value
      });
    } else {
      if (
        nextProps.value && nextProps.value.get && (
          isNumber(nextProps.value.get('at')) || isNumber(nextProps.value.get('to'))
        )
      ) {
        this.setState({
          keyRange: RELATIVE
        });
      } else {
        this.setState({
          keyRange: FIXED
        });
      }
    }
  },

  onSave(value) {
    value = _.assign({}, this.props.value && Immutable.fromJS(this.props.value).toJS(), value);
    value = _.transform(value, (res, v, k) => {
      if (v) res[k] = v;
    });
    value = _.isEmpty(value) ? null : value;

    this.currentValue = value;

    this.props.onSave(this.props.fieldId, value);
  },

  onSelectRange(e) {
    let keyRange = e.target.value;
    let saveValue = keyRange;

    if ([FIXED, RELATIVE].indexOf(keyRange) > -1){
      saveValue = null;
    }

    this.props.onSave(this.props.fieldId, this.currentValue = saveValue);
    this.setState({keyRange});
  },

  render() {
    let startDate, endDate;
    let value = this.props.value;

    if (value && _.isObject(value)) {
      startDate = value.get('at');
      endDate = value.get('to');
    }

    let selectItems = [{
      key: FIXED,
      value: trs('filter.keys.' + FIXED)
    }, {
      key: RELATIVE,
      value: trs('filter.keys.' + RELATIVE)
    }];

    if (AppState.get('filterKeys') && AppState.get('filterKeys').size) {
      let filterKeys = AppState.getIn(['filterKeys', 'date_ranges']).toJS();
      filterKeys.forEach(f => selectItems.push(f));
    }

    return (
      <section className="filter-item__date-field__container filter-date">
        <div className="filter-date__item">
          <select value={this.state.keyRange} onChange={this.onSelectRange}>
            {selectItems.map((it, i) => <option key={i} value={it.key}>{it.value}</option>)}
          </select>
        </div>

        { (this.state.keyRange === FIXED) ?
          <div className="input-range filter-date__item">
            <DateField
              value={startDate}
              onSave={(value)=> this.onSave({at: value && moment(value).startOf(DAY).format(MOMENT_FORMAT)})}
              placeholder={trs('fieldTypes.date.fromText')}/>
            <DateField
              value={endDate}
              onSave={(value)=> this.onSave({to: value && moment(value).endOf(DAY).format(MOMENT_FORMAT)})}
              placeholder={trs('fieldTypes.date.toText')}/>
          </div>
          : null
        }
        { (this.state.keyRange === RELATIVE) ?
          <div className="input-range filter-date__item">
            <span>
              <DebouncedInput
                type="number"
                className="record-date__date"
                value={startDate}
                onSave={(value) => {this.onSave({at: value})}}
                placeholder={trs('fieldTypes.date.fromRelativeText')}/>
            </span>
            <span>
              <DebouncedInput
                type="number"
                className="record-date__date"
                value={endDate}
                onSave={(value) => {this.onSave({to: value})}}
                placeholder={trs('fieldTypes.date.toRelativeText')}/>
              </span>
          </div>
          : null
        }
      </section>
    );
  }
});

export default DateRangeField;
