import _ from 'lodash';

import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import RecordDropdown from './RecordDropdown.jsx';
import Immutable from 'immutable';

const log = require('debug')('CRM:Component:Record:ObjectField');

const ObjectField = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    value: React.PropTypes.object,
    config: React.PropTypes.object,
    fieldId: React.PropTypes.string.isRequired,
    catalogId: React.PropTypes.string.isRequired,
    onSave: React.PropTypes.func.isRequired
  },

  inMapper(item) {
    if ( item.toJS ) {
      item = item.toJS();
    }
    return {
      key: item.recordId + ':' + item.catalogId,
      text: item.recordTitle,
      icon: item.catalogIcon,
      item: item
    };
  },

  outMapper({key, text, item}) {
    let d = key.split(':');
    return {
      recordId: d[0],
      catalogId: d[1],
      recordTitle: text,
      catalogIcon: item && item.catalogIcon
    };
  },

  filterMapper({key}) {
    let d = key.split(':');
    return {
      recordId: d[0],
      catalogId: d[1]
    };
  },

  itemsMapper(item) {
    return {
      key: item.recordId + ':' + item.catalogId,
      text: item.recordTitle,
      icon: item.catalogIcon,
      item: item
    };
  },

  sortFn(items) {
    if ( _.isArray(items) ) {
      let orderedItems = _.sortBy(items, 'recordTitle');
      let dynamicItems = [];
      let otherItems = [];

      items.forEach(item=> {
        if ( item.catalogId === "USER_FIELD" ) {
          dynamicItems.push(item);
        } else {
          otherItems.push(item);
        }
      });

      return dynamicItems.concat(otherItems);
    }

    return items;
  },

  render() {
    let config = this.props.config;
    if (!config) {
      config = Immutable.Map({});
    }
    config = config.set('multiselect', true);

    return (
      <RecordDropdown
          remoteGroup="linkedObjectsWithFilters"
          requestParams={{fieldId: this.props.fieldId, catalogId: this.props.catalogId}}
          {...this.props}
          config={config}
          inMapper={this.inMapper}
          outMapper={this.outMapper}
          itemsMapper={this.itemsMapper}
          filterMapper={this.filterMapper}
          sortFn={this.sortFn}
      />
    );
  }
});

export default ObjectField;
