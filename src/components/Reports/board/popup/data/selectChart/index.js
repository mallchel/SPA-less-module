import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import ImmutablePropTypes from 'react-immutable-proptypes'
import cx from 'classnames'
import _ from 'lodash'

import trs from '../../../../../../getTranslations'

import CHART_ICONS from '../../../../../../configs/reports/widget/chartIcons'
import * as CHART_TYPES from '../../../../../../configs/reports/widget/chartTypes'

const ChartType = function ({ type, selected, disabled, onClick }) {
  return (
    <li
      className={cx('select-widget-type-list__item', {
        'select-widget-type-list__item--selected': selected,
        'select-widget-type-list__item--disabled': disabled
      })}
      onClick={() => !disabled && onClick(type)}
    >
      <nowrap>
        <i className={'select-widget-type-list-item__icon icon icon--' + CHART_ICONS[type]} />
        <span className="select-widget-type-list-item__text">
          {trs('reports.widget.modals.common.preview.types.' + type)}
        </span>
      </nowrap>
    </li>
  );
};

const SelectWidgetChartType = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    widget: ImmutablePropTypes.map.isRequired,
    onChange: React.PropTypes.func.isRequired
  },

  getItems(splitIsSelected) {
    return [
      CHART_TYPES.COLUMNS,
      CHART_TYPES.LINES,
      CHART_TYPES.BARS,
      CHART_TYPES.PIE,
      CHART_TYPES.RADAR,
      CHART_TYPES.NUMBER
    ].map(type => {
      let disabled = type === CHART_TYPES.PIE && splitIsSelected || false;

      return {
        type,
        disabled
      };
    });
  },

  getInitialState() {
    return {
      availableItems: this.getItems(this.props.widget.getIn(['split']))
    }
  },

  componentWillReceiveProps({ widget }) {
    if (this.props.widget.getIn(['split']) !== widget.getIn(['split'])) {
      this.setState({
        availableItems: this.getItems(widget.getIn(['split']))
      }, () => {
        this.selectDefaultValue();
      });
    }
  },

  onChange(type) {
    this.props.onChange({ chartType: type });
  },

  selectDefaultValue() {
    const selectedType = this.props.widget.get('chartType');
    const { availableItems } = this.state;

    const allowed = !!_.find(availableItems, { type: selectedType, disabled: false });

    if (!allowed) {
      this.onChange(availableItems[0].type);
    }
  },

  componentWillMount() {
    this.selectDefaultValue()
  },

  render() {
    const { widget, catalog, board } = this.props;
    const { availableItems } = this.state;

    const selectedType = widget.getIn(['chartType']);

    return (
      <div>
        <strong className="m-padding-content select-widget-type__title">{trs('reports.widget.modals.common.preview.type')}</strong>
        <ul className="select-widget-type-list">
          {availableItems.map(({ type, disabled }) => <ChartType
            key={type}
            type={type}
            disabled={disabled}
            selected={type == selectedType}
            onClick={this.onChange}
          />)}
        </ul>
      </div>
    )
  }
});

export default SelectWidgetChartType;
