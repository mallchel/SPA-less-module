import React from 'react'
import ReactDOM from 'react-dom'

export default function renderComponentToBody(Component, props) {
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
