import React from 'react'
// import PureRenderMixin from 'react-addons-pure-render-mixin'
import filterActions from '../../../../../../../../actions/filterActions'
import trs from '../../../../../../../../getTranslations'
import getFilterComponent from './getFilterComponent'
import FilterBody from './FilterBody'

import styles from './filter.less'

const Filter = React.createClass({
  // mixins: [PureRenderMixin],

  propTypes: {
    catalog: React.PropTypes.object,
    viewId: React.PropTypes.string
  },

  getInitialState() {
    return {};
  },

  onSave(fieldId, value) {
    filterActions.updateFieldFilter({
      catalogId: this.props.catalog.get('id'),
      viewId: this.props.viewId,
      fieldId: fieldId
    }, value);
  },

  componentDidMount() {
  },

  componentWillReceiveProps(nextProps) {
  },

  render() {
    let catalog = this.props.catalog;

    if (!(catalog && catalog.get('fields'))) {
      return null;
    }

    const views = this.props.catalog.get('views');
    const view = views && views.find(v => v.get('id') == this.props.viewId);

    let filters = view && view.get('filters');
    let fields = catalog && catalog
      .get('fields')
      .filter(field => getFilterComponent(field.get('type')));

    if (!fields.size) {
      return null;
    }

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          {trs('filter.header')}
        </div>
        <FilterBody
          filters={filters}
          catalog={catalog}
          onSave={this.onSave}
        />
      </div>
    );
  }
});

export default Filter;
