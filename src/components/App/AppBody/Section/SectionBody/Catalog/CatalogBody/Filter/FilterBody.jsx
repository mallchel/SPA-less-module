import _ from 'lodash'
import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { EventEmitter } from 'events'
import getFilterComponent from './getFilterComponent'
import FilterItem from './FilterItem'

import styles from './filter.less'

const FilterList = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    catalog: React.PropTypes.object.isRequired,
    filters: React.PropTypes.object
  },

  onDrop(fieldId) {
    this.props.onSave(fieldId);
  },

  render() {
    let catalog = this.props.catalog;
    let fields = catalog.get('fields');
    // todo: take out in FilterController. mb.
    let filters = this.props.filters;

    let filterFields = fields
      .map(field => {
        let fieldType = field.get('type');
        let FilterComponent = getFilterComponent(fieldType);
        let props = { value: null };

        if (filters && filters.size) {
          let filterValue = filters.getIn([field.get('id'), 'value']);
          if (filterValue) {
            props.value = filterValue;
          }
        }

        let eventHub = new EventEmitter();

        if (!FilterComponent) {
          return null;
        }

        return (
          <FilterItem
            eventHub={eventHub}
            onDrop={() => this.onDrop(field.get('id'))}
            opened={!!props.value}
            key={catalog.get('id') + '_' + fieldType + '_' + field.get('id')}
            type={fieldType}
            name={field.get('name')}
            value={props.value}>

            <FilterComponent
              eventHub={eventHub}
              catalogId={catalog.get('id')}
              fieldId={field.get('id')}
              config={field.get('config')}
              onSave={this.props.onSave}
              {...props} />
          </FilterItem>
        );
      });


    return (
      <div>
        {filterFields}
      </div>
    );
  }
});

export default FilterList;
