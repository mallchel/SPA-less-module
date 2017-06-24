import React, { Component } from 'react'
import _ from 'lodash'
import { Select } from 'antd'

const Option = Select.Option;

export default class SelectWithFilter extends Component {

  state = {
    value: undefined
  }

  componentDidMount() {
    const value = this.props.value;

    if (value) {
      this.setState({
        value: this.props.mode === 'single' ? value.key : value.map(item => item.key)
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const value = this.props.value;
    const newValue = nextProps.value;

    if (value && !_.isEqual(newValue, value)) {
      this.setState({
        value: this.props.mode === 'single' ? newValue.key : newValue.map(item => item.key)
      });
    }
  }

  onChange = (e) => {
    this.props.onChange(e);
  }

  render() {
    return (
      this.props.items ?
        <Select
          mode={this.props.mode}
          showSearch={this.props.showSearch}
          className={this.props.className}
          placeholder={this.props.placeholder}
          value={this.state.value}
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
          filterOption={(inputValue, option) => option.props.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0}
          onChange={this.onChange}
          onSearch={this.props.onSearch}
        >
          {
            this.props.items.map((item, i) => <Option key={item.key}>{item.text || item.name}</Option>)
          }
        </Select>
        :
        null
    );
  }
}
