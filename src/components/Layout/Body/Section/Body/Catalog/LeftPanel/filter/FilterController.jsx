import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import filterActions from '../../../../../../../../actions/filterActions'
import trs from '../../../../../../../../getTranslations'
import getFilterComponent from './getFilterComponent'
import FilterList from './FilterList'

const FilterController = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    currentCatalogId: React.PropTypes.string,
    currentCatalog: React.PropTypes.object
  },

  getInitialState() {
    return {};
  },

  onSave(fieldId, value) {
    filterActions.updateFieldFilter({
      catalogId: this.props.currentCatalog.get('id'),
      fieldId: fieldId
    }, value);
  },

  componentWillReceiveProps(nextProps) {
  },

  render() {
    let currentCatalog = this.props.currentCatalog;

    if (!(currentCatalog && currentCatalog.get('fields'))) {
      return null;
    }

    let filters = currentCatalog && currentCatalog.getIn(['filters', 'fields']);
    let catalog = this.props.currentCatalog;
    let fields = catalog && catalog
      .get('fields')
      .filter(field => getFilterComponent(field.get('type')));

    if (!fields.size) {
      return null;
    }

    return (
      <div>
        <div>
          {trs('filter.header')}
        </div>
        <FilterList
          filters={filters}
          currentCatalog={this.props.currentCatalog}
          onSave={this.onSave}
        />
      </div>
    );
  }

});

export default FilterController;
