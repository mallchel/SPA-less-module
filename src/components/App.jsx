// styles for fast compile
import '../styles/App.less'

import React, { Component } from 'react'
import { HashRouter } from 'react-router-dom'
import { LocaleProvider } from 'antd'
import ruRu from 'antd/lib/locale-provider/ru_RU'
import Layout from './Layout/Layout'
import NavRoute from './common/router/Route'
import routes from '../routes'
import { confirm } from './common/Modal'
import { Redirect, Route } from 'react-router-dom'
import StateProvider from './StateProvider'


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
          {/*<Route path='/' render={props => (
            props.match && props.match.isExact ? <Redirect to='section/1' /> : <NavRoute route={routes.section} component={Layout} />
          )} />*/}
          <StateProvider component={Layout} />
        </HashRouter>
      </LocaleProvider>
    )
  }
}

export default App;
