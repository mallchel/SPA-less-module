import React from 'react'
import { Modal, Button, Icon, Row } from 'antd'
import ReactDOM from 'react-dom'

const MD = ({ visible, onOk, onCancel, footer }) => {
  return (
    <Modal
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      maskClosable={false}
      closable={false}
      footer={<footer/>}
    >
      <div>
        <Row type="flex" justify="space-between" align="middle" style={{ marginBottom: '10px' }}>
          <h2 style={{ fontWeight: 'normal' }}>Закрыть без сохранений?</h2><Icon onClick={onCancel} style={{ color: '#c1c1c1', fontSize: '32px', margin: '-15px -10px 0 0', cursor: 'pointer' }} type="interface-74"></Icon>
        </Row>
        <Row>
          <p style={{ marginBottom: '10px' }}>Вы изменили запись но не сохранили её.<br />Если вы её закроете, изменения будут утеряны.</p>
        </Row>
      </div>
    </Modal>
  )
}

export default MD;
