import React, { Component } from 'react'
import { Modal, Button, Icon, Row, Input } from 'antd'
import ButtonTransparent from '../elements/ButtonTransparent'
import styles from './modal.less'

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
        <div className={styles.container}>
          <Row type="flex" justify="space-between" align="middle" className={styles.header}>
            <h1>{this.props.title}</h1>
            <ButtonTransparent className={styles.close}>
              <Icon onClick={this.props.onCancel} className={styles.closeIcon} type="interface-74"></Icon>
            </ButtonTransparent>
          </Row>
          <Row className={styles.content}>
            <p>{this.props.contentText}</p>
            {this.props.confirmation && <Input type="text" />}
          </Row>
        </div>
      </Modal>
    )
  }
}

export default Confirm;
