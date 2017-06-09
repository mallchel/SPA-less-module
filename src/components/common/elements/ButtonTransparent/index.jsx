import React, { Component } from 'react'
import { Button } from 'antd'
import cn from 'classnames'
import styles from './buttonTransparent.less'

class ButtonTransparent extends Component {
  render() {
    return (
      <Button
        onClick={this.props.onClick}
        className={cn(this.props.className, styles.btn)}
      >
        {this.props.children}
      </Button>
    )
  }
}

export default ButtonTransparent;
