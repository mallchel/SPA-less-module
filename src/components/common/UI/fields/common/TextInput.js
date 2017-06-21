import _ from 'lodash'
import React, { Component } from 'react'
import cn from 'classnames'
import ReactDOM from 'react-dom'
// import DebouncedInput from '../../../DebouncedInput'
import { Input, InputNumber } from 'antd'

import trs from '../../../../../getTranslations'

import styles from '../fields.less'

class TextInputWithActions extends Component {
  state = { actionsWidth: 0 };

  recalcActionsWidth() {
    const actionsWidth = this.actionsNode && this.actionsNode.clientWidth;

    if (actionsWidth !== this.state.actionsWidth) {
      this.setState({
        actionsWidth
      });
    }
  }

  componentDidMount() {
    this.recalcActionsWidth();
  }

  componentDidUpdate() {
    this.recalcActionsWidth();
  }

  render() {
    const { wrapperClassName, className, style, actionsClassName, inputWrapperClassName, actions, type, multiline, ...props } = this.props;
    const containerCN = cn(wrapperClassName, styles.textInputContainer);
    const inputCN = cn(className);
    const actionsCN = cn(actionsClassName, styles.textInputActions);

    const { actionsWidth } = this.state;
    const inputStyle = _.assign({}, style);
    const actionsStyle = {};

    if (actionsWidth) {
      inputStyle.paddingRight = actionsWidth;
    } else {
      actionsStyle.visibility = 'hidden';
    }

    return (
      <div className={containerCN}>
        {
          type === 'number' ?
            <InputNumber
              ref="inputNumber"
              className={inputCN}
              {...props}
            />
            :
            multiline ?
              <Input
                ref="textArea"
                type="textarea"
                {...props}
                autosize={{
                  minRows: this.props.minRows
                }}
                style={{
                  resize: 'none'
                }}
                className={inputCN}
                onChange={(e) => { this.props.onChange(e.target.value) }}
              />
              :
              <Input
                ref="inputText"
                {...props}
                style={inputStyle}
                className={inputCN}
                onChange={(e) => { this.props.onChange(e.target.value) }}
              />
        }

        {actions && actions.length && (
          <ul className={actionsCN} ref={node => this.actionsNode = node} style={actionsStyle}>
            {actions.map((node, i) => <li key={i}>{node}</li>)}
          </ul>
        ) || null}
      </div>
    );
  }
}

export default class TextInput extends Component {
  onSave = value => {
    console.log(value)
    this.props.onSave && this.props.onSave(value);
  };

  onBlur = e => {
    this.props.onUpdate(e.target.value);
  };

  render() {
    const { updateProcess, actions, ...props } = this.props;
    const shouldProcess = updateProcess && updateProcess.get('shouldProcess');
    const inProcess = updateProcess && updateProcess.get('inProcess');

    const statusCN = cn('record-text-input__status icon', {
      'anticon-icon edition-66': shouldProcess && !inProcess,
      'anticon-icon transfers-74 record-text-input__status--spin spin': inProcess
    });

    const newActions = [...(actions || [])];

    if (shouldProcess || inProcess) {
      newActions.push(
        <span className={statusCN} title={inProcess ? '' : trs('record.fields.text.status.readyToSend')} />
      );
    }

    return (
      <TextInputWithActions
        {...props}
        onBlur={this.onBlur}
        onChange={this.onSave}
        actions={newActions}
      />
    );
  }
}
