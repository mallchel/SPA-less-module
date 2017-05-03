import React from 'react'
import { Modal } from 'antd'

const Base = ({ component: Component, ...props }) => {
  return (
    <Modal
      visible={true}
      maskClosable={false}
      closable={false}
      footer=''
      width='60%'
    >
      <Component {...props} />
    </Modal>
  )
}

export default Base;
