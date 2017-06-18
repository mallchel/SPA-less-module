import _ from 'lodash'
import React, { Component } from 'react'
import cn from 'classnames'

import DebouncedInput from '../../../../../../../../../../common/DebouncedInput'

import trs from '../../../../../../../../../../../getTranslations.js'

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
    const { wrapperClassName, className, style, actionsClassName, inputWrapperClassName, actions, ...props } = this.props;
    const containerCN = cn(wrapperClassName, 'record-text-input');
    const inputCN = cn(className, 'record-text-input__input');
    const actionsCN = cn(actionsClassName, 'record-text-input__actions');

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
        <DebouncedInput
          {...props}
          style={inputStyle}
          wrapperClassName={inputWrapperClassName}
          className={inputCN}
        />

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
    this.props.onSave && this.props.onSave(value);
  };

  onBlur = e => {
    if (this.props.updateProcess && this.props.updateProcess.get('shouldProcess')) {
      this.props.onUpdate(e.target.value);
    }
    this.props.onBlur && this.props.onBlur(e);
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
        onSave={this.onSave}
        actions={newActions}
      />
    );
  }
}
