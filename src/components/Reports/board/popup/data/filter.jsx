import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import ImmutablePropTypes from 'react-immutable-proptypes'
import Immutable from 'immutable'
import _ from 'lodash'

import FilterList from '../../../../App/AppBody/Section/SectionBody/Catalog/CatalogBody/Filter/FilterBody'

const WidgetRecordsFilters = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    catalog: ImmutablePropTypes.map.isRequired,
    widget: ImmutablePropTypes.map.isRequired,
    onChange: React.PropTypes.func.isRequired
  },

  onSave(fieldId, value) {
    let widget = this.props.widget;

    if (_.isEmpty(value)) {
      widget = widget.removeIn(['recordsFilter', 'filters', fieldId]);
    } else {
      const filters = widget.getIn(['recordsFilter', 'filters']) || Immutable.Map();

      widget = widget.merge({
        recordsFilter: {
          filters: filters.merge({
            [fieldId]: value
          })
        }
      });
    }

    return this.props.onChange(null, widget);
  },

  render() {
    return (
      <div className="m-padding-content">
        <FilterList
          currentCatalog={this.props.catalog}
          filters={this.props.widget.getIn(['recordsFilter', 'filters'])}
          onSave={this.onSave}
        />
      </div>
    );
  }
});

export default WidgetRecordsFilters;
