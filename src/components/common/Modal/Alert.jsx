import React, { Component } from 'react'
import { Modal, Button, Icon, Row } from 'antd'
import ReactDOM from 'react-dom'
import style from './modal.less'

class Alert extends Component {
  state = {
    visible: this.props.visible
  }
  handleOk = () => {
    this.setState({
      visible: false
    })
  }
  handleCancel = () => {
    this.setState({
      visible: false
    })
  }
  render() {
    return (
      <Modal
        visible={this.state.visible}
        maskClosable={false}
        closable={false}
        footer={[
          <Button key="submit" type="default" size="large" onClick={this.handleOk}>ОК</Button>,
        ]}
      >
        <div>
          <Row type="flex" justify="space-between" align="middle" className={style.header}>
            <h1>Внимание, это Alert</h1><Icon className={style.close} onClick={this.handleCancel} type="interface-74"></Icon>
          </Row>
          <Row className={style.content}>
            <p>{this.props.text}</p>
          </Row>
        </div>
      </Modal>
    )
  }
}

export default Alert;
