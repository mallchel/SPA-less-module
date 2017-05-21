import _ from 'lodash'
import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { EventEmitter } from 'events'
import debug from 'debug'
import AppState from '../../../../../../../../appState'
import getFilterComponent from './getFilterComponent'
import FilterItem from './FilterItem'

const log = debug('CRM:store:FilterList');

const FilterList = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    currentCatalog: React.PropTypes.object.isRequired,
    filters: React.PropTypes.object
  },

  onDrop(fieldId) {
    this.props.onSave(fieldId);
  },

  render() {
    let catalog = this.props.currentCatalog;
    let fields = catalog.get('fields');
    // todo: take out in FilterController. mb.
    let filters = this.props.filters;

    let currentView = AppState.getIn(['currentCatalog', 'currentView']);

    let filterFields = fields
      .map(field => {
        let fieldType = field.get('type');
        let FilterComponent = getFilterComponent(fieldType);
        let props = { value: null };

        if (filters && filters.size) {
          let fieldFilterValue = filters.get(field.get('id'));
          if (fieldFilterValue) {
            props.value = fieldFilterValue;
          }
        }

        let eventHub = new EventEmitter;

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
            currentView={currentView}
            name={field.get('name')}>

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
      <div className="filter-list">
        {filterFields}
      </div>
    );
  }
});

export default FilterList;
