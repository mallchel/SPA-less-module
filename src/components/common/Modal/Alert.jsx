import React, { Component } from 'react'
import { Modal, Button, Icon, Row } from 'antd'
import ButtonTransparent from '../elements/ButtonTransparent'
import styles from './modal.less'

class Alert extends Component {
  render() {
    return (
      <Modal
        visible={true}
        maskClosable={false}
        closable={false}
        footer={[
          <Button key="submit" type="default" size="large" onClick={this.props.onOk}>{this.props.okText}</Button>,
        ]}
      >
        <div className={styles.container}>
          <Row type="flex" justify="space-between" align="middle" className={styles.header}>
            <h1>{this.props.headerText}</h1>
            <ButtonTransparent className={styles.close}>
              <Icon onClick={this.props.onCancel} className={styles.closeIcon} type="interface-74"></Icon>
            </ButtonTransparent>
          </Row>
          <Row className={styles.content}>
            <p>{this.props.text}</p>
          </Row>
        </div>
      </Modal>
    )
  }
}

export default Alert;
