import React from 'react'
import { Modal } from 'antd'

const Base = props => {
  return (
    <Modal
      visible={true}
      maskClosable={false}
      closable={false}
      _footer=''
      width='60%'
      {...props}
    />
  )
}

/*const Base = ({ Component, props, ...modalProps }) => {
  return (
    <Modal
      visible={true}
      maskClosable={false}
      closable={false}
      footer=''
      width='60%'
      {...modalProps}
    >
      <Component {...props} />
    </Modal>
  )
}*/

export default Base;
