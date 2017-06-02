import React, { Component } from 'react'
import cn from 'classnames'
import AppHeader from './AppHeader'
import AppBody from './AppBody'
import { connect } from '../StateProvider'

import styles from './layout.less'

class layoutApp extends Component {
  render() {
    const containerClassNames = cn(styles.section, {
      'no-select': this.props.dragging
    });

    return (
      <div className={containerClassNames}>
        <AppHeader />
        <AppBody />
      </div>
    )
  }
}

export default connect(layoutApp, ['dragging']);
