import React, { Component } from 'react'
import { Modal, Button, Icon, Row, Input } from 'antd'
import ReactDOM from 'react-dom'
import style from './modal.less'

class Confirm extends Component {
  render() {
    return (
      <Modal
        visible={true}
        maskClosable={false}
        closable={false}
        footer={[
          <Button key="submit" type="danger" size="large" onClick={this.props.onOk}>{this.props.okText}</Button>,
          <Button key="back" type="default" size="large" onClick={this.props.onCancel}>{this.props.cancelText}</Button>,
        ]}
      >
        <div>
          <Row type="flex" justify="space-between" align="middle" className={style.header}>
            <h1>{this.props.title}</h1><Icon onClick={this.props.onCancel} className={style.close} type="interface-74"></Icon>
          </Row>
          <Row className={style.content}>
            <p>{this.props.contentText}</p>
            {this.props.confirmation && <Input type="text" ref={node => this.input = node}/>}
          </Row>
        </div>
      </Modal>
    )
  }
}

export default Confirm;
