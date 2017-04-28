import React from 'react'
import ReactDOM from 'react-dom'

import Base from './Base';
import Confirm from './Confirm';
import Alert from './Alert';
import Prompt from './Prompt';

export default Base;
export { Alert, Confirm, Prompt };

function renderComponentToBody(Component, props) {
  const div = document.createElement('div');

  document.body.appendChild(div);

  ReactDOM.render(
    <Component
      {...props} />, div
  )

  return function destroy() {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  }
}

function renderModaltoBody(Component, props) {
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

  const destroyFn = renderComponentToBody(Component, { ...props, onOk, onCancel, visible: true });
}


function getRenderCompnentToBodyFn(Component) {
  return function (props) {
    renderModaltoBody(Component, props)
  }
}

export const confirm = getRenderCompnentToBodyFn(Confirm)
