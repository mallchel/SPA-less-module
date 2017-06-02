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

export default Base;
