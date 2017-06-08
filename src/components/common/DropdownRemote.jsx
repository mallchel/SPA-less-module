import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Reflux from 'reflux'
import _ from 'lodash'
import PropTypes from 'prop-types'

import appState from '../../appState'
import Dropdown from './Dropdown'
import dropdownActions from '../../actions/dropdownActions'

const log = require('debug')('CRM:Component:DropdownRemote');

const DropdownRemote = React.createClass({
  mixins: [PureRenderMixin, Reflux.listenTo(appState, 'onAppStateChange')],
  propTypes: {
    sortBy: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.func,
      PropTypes.string
    ]),

    type: PropTypes.string.isRequired,
    cacheTime: PropTypes.number,
    searchable: PropTypes.bool,
    additionalItems: PropTypes.array,
    onLoadItems: PropTypes.func,
    filterFn: PropTypes.func,
    itemsMapper: PropTypes.func,
    inMapper: PropTypes.func,
    outMapper: PropTypes.func,
    requestParams: PropTypes.object,
    blockForceUpdateForEmpty: PropTypes.bool
  },
  hasChanges: false,
  onAppStateChange(state) {
    let items = state.getIn(['dropdownCollections', this.props.type, 'items']);
    items = items ? items.toJS() : [];

    if (typeof this.props.itemsMapper === 'function') {
      items = items.map(this.props.itemsMapper);
    }

    // fixed:
    this.updateStateItems(items);

    this.setState({
      loading: !!state.getIn(['dropdownCollections', this.props.type, 'loading'])
    });
  },

  updateStateItems(items) {
    let noEmptyRemoteItems = !(items.length === 0 && this.state.items.length > 0) ||
      !this.props.blockForceUpdateForEmpty;
    if (!_.isEqual(this.state.items, items) && noEmptyRemoteItems) {
      this.setState({ items });
    }
  },

  getInitialState() {
    let items = appState.getIn(['dropdownCollections', this.props.type, 'items']);
    items = items ? items.toJS() : [];
    if (typeof this.props.itemsMapper === 'function') {
      items = items.map(this.props.itemsMapper);
    }
    return {
      text: '',
      loading: !!appState.getIn(['dropdownCollections', this.props.type, 'loading']),
      items
    };
  },

  onOpenChange(isOpen) {
    if (isOpen && !this.hasChanges) {
      //this.setState({items: []}); //Из за этого глючит выбор в связаном списке в настройках каталога
      let params = _.extend({ title: this.state.text }, this.props.requestParams);
      dropdownActions.loadDropdownItems(this.props.type, params);
      this.setState({
        loading: true
      });
    } else if (isOpen && this.hasChanges) {
      this.setState({ items: [] });
      let params = _.extend({ title: this.state.text }, this.props.requestParams);
      dropdownActions.loadDropdownItems(this.props.type, params);
    } else if (!isOpen) {
      dropdownActions.clearDropdownItems(this.props.type);
    }
  },

  onTextChange(text) {
    if (this.props.searchable) {
      this.hasChanges = true;
      this.setState({ text });
      let params = _.extend({ title: this.state.text }, this.props.requestParams);
      dropdownActions.loadDropdownItems(this.props.type, params);
    }
  },

  onSelectItems(items) {
    if (typeof this.props.outMapper === 'function') {
      items = items.map(this.props.outMapper);
    }
    this.props.onSelectItems(items);
  },

  componentDidUpdate(prevProps, prevState) {
    if (this.props.onLoadItems && this.state.items.length && this.state.items !== prevState.items) {
      this.props.onLoadItems(this.state.items);
    }
  },

  onBlurDropdown() {
    if (this.props.onBlur) {
      this.props.onBlur();
    }
  },

  render() {
    let items = this.state.items;
    let additionalItems = this.props.additionalItems;

    if (additionalItems) {
      if (typeof this.props.itemsMapper === 'function') {
        additionalItems = additionalItems.map(this.props.itemsMapper);
      }
      items = items.concat(additionalItems);
    }

    if (this.props.filterFn) {
      items = items.filter(this.props.filterFn);
    }

    let sortBy = this.props.sortBy;
    items = _.uniq(items, 'key');
    if (sortBy === undefined || sortBy === true) {
      items = _.sortBy(items, 'text');
    } else if (sortBy) {
      items = _.sortBy(items, sortBy);
    }

    log('items', items);

    let onTextChange = _.debounce(this.onTextChange, 200);

    return <Dropdown
      {...this.props}
      onSelectItems={this.onSelectItems}
      showLoading={this.state.loading}
      items={items}
      onBlur={this.onBlurDropdown}
      placeholder={this.props.placeholder}
      onTextChange={onTextChange}
      onOpenChange={this.onOpenChange} />;
  }
});

export default DropdownRemote;
