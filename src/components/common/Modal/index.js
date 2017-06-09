import React from 'react';
import Base from './Base';
import Confirm from './Confirm';
import Alert from './Alert';
import Prompt from './Prompt';
import renderComponentToBody from '../../../helpers/renderComponentToBody'
import { MemoryRouter } from 'react-router'

export default Base;

export function renderModaltoBody(Component, props) {
  function afterClose() {
    destroyFn();
  }

  function onOk(...args) {
    afterClose();
    if (props.onOk) {
      props.onOk.call(this, ...args);
    }
  }

  function onCancel(...args) {
    afterClose();
    if (props.onCancel) {
      props.onCancel.call(this, ...args);
    }
  }

  // const destroyFn = renderComponentToBody(Component, { ...props, onOk, onCancel, visible: true });
  const destroyFn = renderComponentToBody(MemoryRouter, { children: <Component visible {...props} onOk={onOk} onCancel={onCancel} /> });
}


function getRenderComponentToBodyFn(Component) {
  return function (props) {
    renderModaltoBody(Component, props)
  }
}

export const confirm = getRenderComponentToBodyFn(Confirm);
export const alert = getRenderComponentToBodyFn(Alert);
export const prompt = getRenderComponentToBodyFn(Prompt);

export function base(Component, props) {
  renderModaltoBody(Base, { children: <Component {...props} />, onOk: props.onOk, onCancel: props.onCancel });
}
