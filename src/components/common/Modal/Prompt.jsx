import React, { Component } from 'react'
import { Modal, Button, Icon, Row, Input } from 'antd'
import style from './modal.less'

class Prompt extends Component {
  state = {
    visible: this.props.visible
  }
  handleOk = () => {
    this.props.callback(true);
    this.setState({
      visible: false
    })
    console.log(this.input.refs.input);
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
          <Button key="submit" type="primary" size="large" onClick={this.handleOk}>{this.props.okText}</Button>,
          <Button key="back" type="default" size="large" onClick={this.handleCancel}>{this.props.cancelText}</Button>,
        ]}
      >
        <div>
          <Row type="flex" justify="space-between" align="middle" className={style.header}>
            <h1>{this.props.title}</h1><Icon onClick={this.handleCancel} className={style.close} type="interface-74"></Icon>
          </Row>
          <Row className={style.content}>
            <p>{this.props.contentText}</p>
            <Input type="text" ref={node => this.input = node} />
          </Row>
        </div>
      </Modal>
    )
  }
}

export default Prompt;
