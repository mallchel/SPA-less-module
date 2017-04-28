// styles for fast compile
import '../styles/App.less'

import React, { Component } from 'react'
import { HashRouter } from 'react-router-dom'
import { LocaleProvider } from 'antd'
import ruRu from 'antd/lib/locale-provider/ru_RU'
// import GetConfirmation from './common/router/GetConfirmation'
import Section from './Layout/section/Section'
import NavRoute from './common/router/Route'
import routes from '../routes'
import ReactDOM from 'react-dom'
import { confirm } from './common/Modal'


const getConfirmation = (message, callback, state) => {
  function onOk() {
    callback(true);
  }

  function onCancel() {
    callback(false);
  }

  confirm({
    onOk, onCancel,
    title: 'Удалить каталог?',
    contentText: `У вас каталог не сохранится`,
    okText: 'Уйти отсюда',
    cancelText: 'Отменить',
    confirmation: 'aaa',
  })
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
