import React, { Component } from 'react'
import cn from 'classnames'
import AppHeader from './AppHeader'
import AppBody from './AppBody'

import styles from './layout.less'

class layoutApp extends Component {
  render() {
    const containerClassNames = cn(styles.section, {
      'no-select': this.props.appState.get('dragging')
    });

    return (
      <div className={containerClassNames}>
        <AppHeader { ...this.props } />
        <AppBody {...this.props} />
      </div>
    )
  }
}

export default layoutApp;
