import _ from 'lodash';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ImmutablePropTypes from 'react-immutable-proptypes';

import trs from '../../../../../../../getTranslations';
import Dropdown from '../../../../../../common/Dropdown';

import * as VALUE_TYPES from '../../../../../../../configs/reports/widget/valuesTypes';
import * as VALUE_FNS from '../../../../../../../configs/reports/widget/valuesFunctions';
import FIELD_TYPES from '../../../../../../../configs/fieldTypes';

/**
 * From task: https://trello.com/c/T8OxZIpO/426--
 * — Количество записей — [нет функции]
 * — Поля «Число» — сумма!, среднее, максимальное, минимальное
 * — Поля «Прогресс» — сумма, среднее!, максимальное, минимальное
 * — Поля «Звезды» — сумма, среднее!, максимальное, минимальное
 * — Время в значении в поле «Категория/Вопрос/Галочки» — суммарное, среднее!, максимальное, минимальное
 * — Время до наступления значения в поле «Категория/Вопрос/Галочки»— суммарное, среднее!, максимальное, минимальное
 * @param value
 * @param fields
 * @returns {Array}
 */
function _getAvailableFunctions(value, fields) {
  const valueType = value.get('type');

  switch (valueType) {
    case VALUE_TYPES.RECORDS_COUNT:
      return [];
    case VALUE_TYPES.FIELD:
      const field = fields.find(f=> f.get('id') == value.get('value'));

      // field already could be removed
      if (!field) {
        return [];
      }

      const fieldType = fields.find(f=> f.get('id') == value.get('value')).get('type');

      switch (fieldType) {
        case FIELD_TYPES.NUMBER:
          return [
            {
              key: VALUE_FNS.SUM,
              isDefault: true
            },
            {
              key: VALUE_FNS.AVG
            },
            {
              key: VALUE_FNS.AVG_ALL
            },
            {
              key: VALUE_FNS.MAX
            },
            {
              key: VALUE_FNS.MIN
            }
          ];
        case FIELD_TYPES.PROGRESS:
        case FIELD_TYPES.STARS:
        case FIELD_TYPES.DROPDOWN:
        case FIELD_TYPES.CHECKBOXES:
        case FIELD_TYPES.RADIOBUTTON:
          return [
            {
              key: VALUE_FNS.SUM
            },
            {
              key: VALUE_FNS.AVG,
              isDefault: true
            },
            {
              key: VALUE_FNS.MAX
            },
            {
              key: VALUE_FNS.MIN
            }
          ];
      }

      return [];
  }
}

function getAvailableFunctions(...args) {
  return _getAvailableFunctions(...args).map(item=> {
    return {
      ...item,
      text: trs('reports.widget.modals.common.tabs.data.value.functions.' + item.key)
    }
  })
}

const SelectValueFunction = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    fields: ImmutablePropTypes.list.isRequired,
    onChange: React.PropTypes.func.isRequired,
    value: ImmutablePropTypes.map.isRequired,
    selectedFn: React.PropTypes.string
  },

  getInitialState() {
    return {
      availableFunctions: getAvailableFunctions(this.props.value, this.props.fields)
    }
  },

  onChangeSelect(valueKey) {
    this.props.onChange(valueKey);
  },

  getDefaultSelectedFn() {
    const {availableFunctions} = this.state;

    if (!availableFunctions.length) {
      return null;
    }

    return _.find(availableFunctions, {isDefault: true}).key;
  },

  setDefaultSelectedFn() {
    this.props.onChange(this.getDefaultSelectedFn());
  },

  componentWillReceiveProps({fields, value, selectedFn}) {
    if (this.props.fields !== fields || this.props.value !== value) {
      this.setState({
        availableFunctions: getAvailableFunctions(value, fields)
      }, ()=> {
        if (!selectedFn) {
          this.setDefaultSelectedFn();
        }
      });
    }
  },

  componentWillMount() {
    const {selectedFn} = this.props;

    if (!selectedFn) {
      this.setDefaultSelectedFn();
    }
  },

  render() {
    const {selectedFn} = this.props;
    const {availableFunctions} = this.state;

    if (!availableFunctions.length || !selectedFn) {
      return null;
    }

    return (
      <Dropdown
        items={availableFunctions}
        multiselect={false}
        value={selectedFn}
        withButton={true}
        onSelectItems={([item])=> this.onChangeSelect(item.key)}
      />
    );
  }
});

export default SelectValueFunction;
