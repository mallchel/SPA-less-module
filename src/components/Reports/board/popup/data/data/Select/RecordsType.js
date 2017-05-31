import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ImmutablePropTypes from 'react-immutable-proptypes';
import cx from 'classnames';

import trs from '../../../../../../../getTranslations';
import {checkAccessOnObject} from '../../../../../../../utils/rights';

import PRIVILEGE_CODES from '../../../../../../../configs/privilegeCodes';
import RESOURCE_TYPES from '../../../../../../../configs/resourceTypes';
import {ALL, AVAILABLE} from '../../../../../../../configs/reports/widget/recordsTypes';

const SelectRecordsType = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    catalog: ImmutablePropTypes.map.isRequired,
    onChange: React.PropTypes.func.isRequired,
    value: React.PropTypes.string
  },

  getAvailableItems(catalog) {
    const items = [];

    if (checkAccessOnObject(RESOURCE_TYPES.CATALOG, catalog, PRIVILEGE_CODES.ADMIN)) {
      items.push(ALL);
    }

    items.push(AVAILABLE);

    return items;
  },

  getInitialState() {
    return {
      availableItems: this.getAvailableItems(this.props.catalog)
    }
  },

  componentWillReceiveProps({catalog}) {
    if (this.props.catalog !== catalog) {
      this.setState({
        availableItems: this.getAvailableItems(catalog)
      });
    }
  },

  componentWillMount() {
    const {value} = this.props;

    if (!value) {
      this.props.onChange(this.state.availableItems[0]);
    }
  },

  render() {
    const {value} = this.props;
    const {availableItems} = this.state;

    return (
      <ul className="filter m-clearfix">
        {availableItems.map(item=> {
          return (
            <li
              className={cx('filter__item', {'filter__item--selected': item == value})}
              key={item}
              onClick={()=> this.props.onChange(item)}>
              <span className="filter__item__link">{
                trs('reports.widget.modals.common.tabs.data.records.types.' + item)
              }</span>
            </li>
          )
        })}
      </ul>
    )
  }
});

export default SelectRecordsType;
