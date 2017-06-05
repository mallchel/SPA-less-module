import React from 'react'
import { Modal } from 'antd'
// import { MemoryRouter } from 'react-router'

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
