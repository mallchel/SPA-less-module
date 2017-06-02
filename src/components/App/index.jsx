// styles for fast compile
import '../../styles/App.less'
import './configure'

import React, { Component } from 'react'
import { HashRouter } from 'react-router-dom'
import { LocaleProvider } from 'antd'
import ruRu from 'antd/lib/locale-provider/ru_RU'
import LayoutApp from './layoutApp'
import { confirm } from '../common/Modal'
import StateProvider from '../StateProvider'

const getConfirmation = (message, callback, state) => {
  function onOk() {
    callback(true);
  }

  function onCancel() {
    callback(false);
  }

  confirm({
    onOk, onCancel,
    headerText: 'Удалить каталог?',
    text: `У вас каталог не сохранится`,
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
          {/*<StateProvider component={LayoutApp} />*/}
          <LayoutApp />
        </HashRouter>
      </LocaleProvider>
    )
  }
}

export default App;
