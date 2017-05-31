import React from 'react'
import ImmutableProptypes from 'react-immutable-proptypes'

import PureRenderMixin from 'react-addons-pure-render-mixin'
import Immutable from 'immutable'
import _ from 'lodash'
import RecordDropdown from './RecordDropdown.jsx'
import modalActions from '../../../../../../../../../../actions/modalsActions'
import linkedRecordActions from '../../../../../../../../../../actions/linkedRecord'

import appState from '../../../../../../../../../../appState'

const ObjectField = React.createClass({
  mixins: [
    PureRenderMixin
  ],
  propTypes: {
    value: ImmutableProptypes.list,
    config: React.PropTypes.object,
    fieldId: React.PropTypes.string.isRequired,
    catalogId: React.PropTypes.string.isRequired,
    recordId: React.PropTypes.string,
    onSave: React.PropTypes.func,
    onUpdate: React.PropTypes.func,
  },

  inMapper(item) {
    if (item.toJS) {
      item = item.toJS();
    }
    return {
      key: item.recordId + ':' + item.catalogId,
      text: item.recordTitle,
      icon: item.catalogIcon,
      item: item
    };
  },

  outMapper({ key, text, item }) {
    let d = key.split(':');
    return {
      recordId: d[0],
      catalogId: d[1],
      sectionId: item.sectionId ? item.sectionId : null,
      recordTitle: text,
      catalogIcon: item && item.catalogIcon
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

  openLinkedRecordCreate(catalog) {
    modalActions.openLinkedRecordCreate(catalog.id, {
      onCreate: result => this.onRecordCreate(catalog, result),
      allowClose: true
    });
  },

  onSave(data) {
    if (this.props.onSave) {
      this.props.onSave(data);
    }
    if (this.props.onUpdate) {
      this.props.onUpdate(data);
    }
  },

  onRecordCreate(catalog, { id: recordId }) {
    let { value } = this.props;
    value = value || Immutable.List();
    this.onSave(value.push(Immutable.fromJS({
      recordId,
      recordTitle: '',
      catalogId: catalog.id,
      catalogIcon: catalog.icon,
      catalogTitle: catalog.title,
      sectionId: appState.getIn(['catalogs', catalog.id, 'sectionId'])
    })));

    linkedRecordActions.updateRecordLinkedRecord({
      catalogId: this.props.catalogId,
      recordId: this.props.recordId,
      fieldId: this.props.fieldId,
    }, {
        catalogId: catalog.id,
        recordId
      });
  },

  render() {
    let config = this.props.config;
    if (!config) {
      config = Immutable.Map({});
    }
    let startCatalogs = config.get('catalogs') && config.get('catalogs').toJS() || [];
    let startViews = config.get('views') && config.get('views').map(view => { return { id: view.get('catalogId'), title: view.get('catalogTitle') } }).toJS() || [];
    let startItems = startCatalogs.concat(startViews);
    startItems = _.unique(startItems, 'id');

    return (
      <RecordDropdown
        remoteGroup="linkedObjects"
        requestParams={{ fieldId: this.props.fieldId, catalogId: this.props.catalogId }}
        {...this.props}
        onSave={this.onSave}
        config={config}
        searchable={true}
        clickable={true}
        additionalClickItems={startItems}
        onClickAddLinkedItem={(val) => this.openLinkedRecordCreate(val)}
        inMapper={this.inMapper}
        outMapper={this.outMapper}
        itemsMapper={this.itemsMapper} />
    );
  }
});

export default ObjectField;
