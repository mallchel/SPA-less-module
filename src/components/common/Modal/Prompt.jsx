import React, { Component } from 'react'
import { Modal, Button, Icon, Row, Input } from 'antd'
import ReactDOM from 'react-dom'
import ButtonTransparent from '../elements/ButtonTransparent'
import styles from './modal.less'

class Prompt extends Component {
  state = {
    value: this.props.value
  }
  componentDidMount() {
    let el = ReactDOM.findDOMNode(this.input);
    el.focus();
    el.setSelectionRange(0, el.value.length);
  }
  onChange = (e) => {
    this.setState({
      value: e.target.value
    });
  }

  isValid = () => {
    return this.props.value !== this.state.value && this.state.value;
  }

  onSave = (e) => {
    e.preventDefault();
    if (!this.isValid()) {
      return;
    }
    this.props.onOk(this.state.value);
  }
  render() {
    return (
      <Modal
        visible={true}
        maskClosable={false}
        closable={false}
        footer={[
          <Button key="submit" disabled={!this.isValid()} type="primary" size="large" onClick={this.onSave}>{this.props.okText}</Button>,
          <Button key="back" type="default" size="large" onClick={this.props.onCancel}>{this.props.cancelText}</Button>,
        ]}
      >
        <div className={styles.container}>
          <Row type="flex" justify="space-between" align="middle" className={styles.header}>
            <h1>{this.props.headerText}</h1>
            <ButtonTransparent className={styles.close}>
              <Icon onClick={this.props.onCancel} className={styles.closeIcon} type="icon interface-74"></Icon>
            </ButtonTransparent>
          </Row>
          <Row className={styles.content}>
            <p>{this.props.text}</p>
            <form onSubmit={this.onSave}>
              <Input
                type="text"
                ref={node => this.input = node}
                defaultValue={this.props.value}
                onChange={this.onChange}
              />
            </form>
          </Row>
        </div>
      </Modal>
    )
  }
}

export default Prompt;
