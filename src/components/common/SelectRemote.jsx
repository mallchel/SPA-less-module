import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import _ from 'lodash'
import PropTypes from 'prop-types'
import { Select } from 'antd'

import Dropdown from './Dropdown'
import dropdownActions from '../../actions/dropdownActions'
import { connect } from '../StateProvider'

const Option = Select.Option;

const SelectRemote = React.createClass({
  mixins: [PureRenderMixin],
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

  componentWillReceiveProps(nextProps) {
    let items = nextProps.dropdownCollections.getIn([nextProps.type, 'items']);
    items = items ? items.toJS() : [];    
    console.log(items)
    this.updateStateItems(items)
  },

  updateStateItems(items) {
    let noEmptyRemoteItems = !(items.length === 0 && this.state.items.length > 0) ||
      !this.props.blockForceUpdateForEmpty;
    if (!_.isEqual(this.state.items, items) && noEmptyRemoteItems) {
      this.setState({ items });
    }
  },

  getInitialState() {
    let items = this.props.dropdownCollections.getIn([this.props.type, 'items']);
    items = items ? items.toJS() : [];
    if (typeof this.props.itemsMapper === 'function') {
      items = items.map(this.props.itemsMapper);
    }
    return {
      text: '',
      loading: !!this.props.dropdownCollections.getIn([this.props.type, 'loading']),
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

    let onTextChange = _.debounce(this.onTextChange, 200);

    return <Select
      mode="multiple"
      style={{ width: '100%' }}
      defaultValue={this.props.value.map(item => item.text)}
      onFocus={() => this.onOpenChange(true)}
      onBlur={() => this.onOpenChange(false)}
    >
      {
        [<Option key='1'>asdd</Option>,
        <Option key='2'>abdd</Option>]
        /*items.map((item, i) => <Option key={item.key}>{item.text}</Option>)*/
      }
    </Select>

  }
});

export default connect(SelectRemote, ['dropdownCollections']);
