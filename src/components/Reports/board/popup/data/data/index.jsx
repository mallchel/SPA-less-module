import React from 'react'
import debug from 'debug'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import ImmutablePropTypes from 'react-immutable-proptypes'

import trs from '../../../../../../getTranslations'

import SelectValue from './Select/Value'
import SelectValueFunction from './Select/ValueFunction'
import SelectAxis from './Select/Axis'
import SelectSplit from './Select/Split'
import SelectRecordsType from './Select/RecordsType'
import SelectStacked from './Select/Stacked'

const log = debug('Widget:Config:Data:');

const WidgetData = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    catalog: ImmutablePropTypes.map.isRequired,
    widget: ImmutablePropTypes.map.isRequired,
    onChange: React.PropTypes.func.isRequired
  },

  componentWillReceiveProps({ widget }) {
    if (this.props.widget !== widget) {
      log('changed', widget.toJSON());
    }
  },

  render() {
    const { catalog, widget, onChange } = this.props;
    const fields = catalog.get('fields');

    const value = widget.getIn(['value']);
    const axis = widget.getIn(['axis']);
    const split = widget.getIn(['split']);
    const stacked = widget.getIn(['stacked']);
    const valueFn = widget.getIn(['valueFn']);

    let selectValueFunction = null;

    if (value) {
      selectValueFunction = <SelectValueFunction
        fields={fields}
        value={value}
        selectedFn={valueFn}
        onChange={value => onChange({ valueFn: value })} />
    }

    return (
      <div className="widget-edit-config container-fluid">
        <div className="row widget-edit-config__option-row">
          <div className="col-md-3 widget-edit-config__option-label"><strong>{
            trs('reports.widget.modals.common.tabs.data.value.label')
          }</strong></div>
          <div className="col-md-5 widget-edit-config__option-value">
            <SelectValue
              fields={fields}
              value={value}
              onChange={value => onChange({ value, valueFn: null })} />
          </div>
          <div className="col-md-4 widget-option-value-fn">
            {valueFn ? <span className="functions-label widget-option-value-fn__label">f</span> : null}
            {selectValueFunction}
          </div>
        </div>
        <div className="row widget-edit-config__option-row">
          <div className="col-md-3 widget-edit-config__option-label"><strong>{
            trs('reports.widget.modals.common.tabs.data.axis.label')
          }</strong></div>
          <div className="col-md-5 widget-edit-config__option-value">
            <SelectAxis
              fields={fields}
              value={axis}
              onChange={value => onChange({ axis: value })} />
          </div>
        </div>
        <div className="row widget-edit-config__option-row">
          <div className="col-md-3 widget-edit-config__option-label"><strong>{
            trs('reports.widget.modals.common.tabs.data.split.label')
          }</strong></div>
          <div className="col-md-5 widget-edit-config__option-value">
            <SelectSplit
              fields={fields}
              value={split}
              onChange={value => onChange({ split: value })} />
          </div>
          <div className="col-md-4 widget-edit-config__option-stacked">
            <SelectStacked
              value={stacked}
              onChange={value => onChange({ stacked: value })}
            />
          </div>
        </div>
        <div className="row widget-edit-config__option-row">
          <div className="col-md-3 widget-edit-config__option-label"><strong>{
            trs('reports.widget.modals.common.tabs.data.records.label')
          }</strong></div>
          <div className="col-md-9 widget-edit-config__option-value">
            <SelectRecordsType
              catalog={catalog}
              value={widget.getIn(['recordsType'])}
              onChange={value => onChange({ recordsType: value })} />
          </div>
        </div>
      </div>
    );
  }
});

export default WidgetData;
