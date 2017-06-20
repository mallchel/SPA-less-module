import React, { Component } from 'react'
import _ from 'lodash'
import { Select } from 'antd'

const Option = Select.Option;

export default class SelectWithFilter extends Component {

  state = {
    value: ''
  }

  filterOption(inputValue, option) {
    const searchText = inputValue.toLowerCase();
    const res = option.props.children.toLowerCase().indexOf(searchText);
    if (res !== -1) {
      return option;
    }
  }

  componentDidMount() {
    this.setState({
      value: this.props.mode === 'single' ? this.props.value && this.props.value.key : this.props.value.map(item => item.key)
    });
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.value !== this.props.value)) {
      this.setState({
        value: this.props.mode === 'single' ? this.props.value && this.props.value.key : this.props.value.map(item => item.key)
      });
    }
  }

  onChange = (e) => {
    this.props.onChange(e);
  }

  render() {
    return (
      <Select
        mode={this.props.mode}
        showSearch={this.props.showSearch}
        className={this.props.className}
        placeholder={this.props.placeholder}
        value={this.state.value}
        onFocus={this.props.onFocus}
        onBlur={this.props.onBlur}
        filterOption={this.filterOption}
        onChange={this.onChange}
        onSearch={this.props.onSearch}
      >
        {
          this.props.items.map((item, i) => <Option key={item.key}>{item.text}</Option>)
        }
      </Select>
    );
  }
}
