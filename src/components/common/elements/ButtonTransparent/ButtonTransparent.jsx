import React, { Component } from 'react'
import { Button } from 'antd'

class ButtonTransparent extends Component {
  render() {
    return (
      <Button onClick={this.props.onClick} className={this.props.className ? `btn-transparent ${this.props.className}` : 'btn-transparent'}>{this.props.children}</Button>
    )
  }
}

export default ButtonTransparent;
