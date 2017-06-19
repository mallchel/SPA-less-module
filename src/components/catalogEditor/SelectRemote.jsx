import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import _ from 'lodash'
import PropTypes from 'prop-types'
// import { Select } from 'antd'

import dropdownActions from '../../actions/dropdownActions'
import trs from '../../getTranslations'
import { connect } from '../StateProvider'
import SelectWithFilter from '../common/elements/SelectWithFilter'

import styles from './catalogEditor.less'

// const Option = Select.Option;

const SelectRemote = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    sortBy: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.func,
      PropTypes.string
    ]),

    type: PropTypes.string.isRequired,
    // additionalItems: PropTypes.array,
    onLoadItems: PropTypes.func,
    filterFn: PropTypes.func,
    itemsMapper: PropTypes.func,
    inMapper: PropTypes.func,
    outMapper: PropTypes.func,
    requestParams: PropTypes.object,
    blockForceUpdateForEmpty: PropTypes.bool
  },

  componentWillReceiveProps(nextProps) {
    let items = nextProps.dropdownCollections.getIn([nextProps.type, 'items']);
    items = items ? items.toJS() : [];
    this.updateStateItems(items)
  },

  updateStateItems(items) {
    let noEmptyRemoteItems = !(items.length === 0 && this.state.items.length > 0);
    if (!_.isEqual(this.state.items, items) && noEmptyRemoteItems) {
      this.setState({
        items,
        loading: !!this.props.dropdownCollections.getIn([this.props.type, 'loading'])
      });
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
      items,
    };
  },

  onOpenChange(isOpen) {
    if (isOpen) {
      let params = _.extend({ title: this.state.text }, this.props.requestParams);
      dropdownActions.loadDropdownItems(this.props.type, params);
      this.setState({
        loading: true
      });
    } else if (!isOpen) {
      dropdownActions.clearDropdownItems(this.props.type);
    }
  },

  // onTextChange(text) {
  //   if (this.props.searchable) {
  //     this.hasChanges = true;
  //     this.setState({ text });
  //     let params = _.extend({ title: this.state.text }, this.props.requestParams);
  //     dropdownActions.loadDropdownItems(this.props.type, params);
  //   }
  // },

  // onSelectItems(items) {
  //   if (typeof this.props.outMapper === 'function') {
  //     items = items.map(this.props.outMapper);
  //   }
  //   this.props.onSelectItems(items);
  // },

  componentDidUpdate(prevProps, prevState) {
    if (this.props.onLoadItems && this.state.items.length && this.state.items !== prevState.items) {
      this.props.onLoadItems(this.state.items);
    }
  },

  onChange(itemsKey) {
    let items = this.state.items.concat(this.props.value);
    items = _.uniq(items, 'key');
    let selectedItems = [];
    items.forEach(item => {
      itemsKey.forEach((key) => {
        if (item.key === key) {
          selectedItems.push(item);
        }
      })
    })
    this.props.onSelectItems(selectedItems);
  },

  filterOption(inputValue, option) {
    const searchText = inputValue.toLowerCase();
    const res = option.props.children.toLowerCase().indexOf(searchText);
    if (res !== -1) {
      return option;
    }
  },

  render() {
    let items = this.state.items.concat(this.props.value);

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

    return (
      <SelectWithFilter
        mode="multiple"
        className={styles.selectRemote}
        defaultValue={this.props.value}
        onChange={this.onChange}
        filterOption={this.filterOption}
        placeholder={this.props.placeholder}
        notFoundContent={trs('dropdown.noitems')}
        onFocus={() => this.onOpenChange(true)}
        onBlur={() => this.onOpenChange(false)}
        items={items}
      />
    )

    // return <Select
    //   mode="multiple"
    //   className={styles.selectRemote}
    //   defaultValue={this.props.value.map(item => item.key)}
    //   onChange={this.onChange}
    //   filterOption={this.filterOption}
    //   placeholder={this.props.placeholder}
    //   notFoundContent={trs('dropdown.noitems')}
    // >
    //   {
    //     items.map((item, i) => <Option key={item.key}>{item.text}</Option>)
    //   }
    // </Select>

  }
});

export default connect(SelectRemote, ['dropdownCollections']);
