// styles for fast compile
import '../../styles/App.less'

import React, { Component } from 'react'
import { HashRouter } from 'react-router-dom'
import { LocaleProvider } from 'antd'
import ruRu from 'antd/lib/locale-provider/ru_RU'
// import { createHashHistory } from 'history'
import layoutApp from './layoutApp'
import { confirm } from '../common/Modal'
import StateProvider from '../StateProvider'
// import syncHistoryWithStore from '../sync'
// import appState from '../../appState'
// import apiActions from '../../actions/apiActions'

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

// const history = createHashHistory({
//   getUserConfirmation: getConfirmation
// });
// const customHistory = syncHistoryWithStore(history, appState);

class App extends Component {
  render() {
    return (
      <LocaleProvider locale={ruRu}>
        <HashRouter getUserConfirmation={getConfirmation}>
          <StateProvider component={layoutApp} />
        </HashRouter>
        {/*<Router history={customHistory}>
          <StateProvider component={layoutApp} />
        </Router>*/}
      </LocaleProvider>
    )
  }
}

export default App;
