import React, { Component } from 'react'
import { HashRouter } from 'react-router-dom'
import { LocaleProvider } from 'antd'
import ruRu from 'antd/lib/locale-provider/ru_RU'
// import GetConfirmation from './common/router/GetConfirmation'
import Section from './Layout/section/Section'
import NavRoute from './common/router/Route'
import routes from '../routes'
import ReactDOM from 'react-dom'
import { Confirm } from './common/Modal'

//styles
import '../styles/App.less'

const getConfirmation = (message, callback, state) => {
  let div = document.createElement('div');

  function onOk() {
    callback(true);
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  }

  function onCancel() {
    callback(false);
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  }

  document.body.appendChild(div);
  ReactDOM.render(
    <Confirm
      visible
      confirmation
      onOk={onOk}
      onCancel={onCancel}
      title={'Удалить каталог?'}
      contentText={`У вас каталог не сохранится`}
      okText={'Уйти отсюда'}
      cancelText={'Отменить'} />, div
  )
}

class App extends Component {
  render() {
    return (
      <LocaleProvider locale={ruRu}>
        <HashRouter getUserConfirmation={getConfirmation}>
          <NavRoute route={routes.section} component={Section} />
        </HashRouter>
      </LocaleProvider>
    )
  }
}

export default App;
