import React from 'react'
import { Modal, Icon, Row } from 'antd'
import ButtonTransparent from '../elements/ButtonTransparent'
import styles from './modal.less'

const Base = ({ visible, onOk, onCancel, footer }) => {
  return (
    <Modal
      visible={true}
      maskClosable={false}
      closable={false}
      footer=''
    >
      <div>

      </div>
    </Modal>
  )
}

export default Base;
