import React, { Component } from 'react'
import { Select } from 'antd'

const Option = Select.Option;

export default class SelectWithFilter extends Component {

  filterOption(inputValue, option) {
    const searchText = inputValue.toLowerCase();
    const res = option.props.children.toLowerCase().indexOf(searchText);
    if (res !== -1) {
      return option;
    }
  }

  render() {
    const defaultValue = this.props.mode === 'single' ? this.props.defaultValue && this.props.defaultValue.key : this.props.defaultValue.map(item => item.key);
    console.log(defaultValue, this.props.items)
    return (
      <Select
        mode={this.props.mode}
        showSearch={this.props.mode === 'single'}
        className={this.props.className}
        placeholder={this.props.placeholder}
        defaultValue={defaultValue}
        onFocus={this.props.onFocus}
        onBlur={this.props.onBlur}
        filterOption={this.filterOption}
        onChange={this.props.onChange}
        onSearch={this.props.onSearch}
      >
        {
          this.props.items.map((item, i) => <Option key={item.key}>{item.text}</Option>)
        }
      </Select>
    );
  }
}
