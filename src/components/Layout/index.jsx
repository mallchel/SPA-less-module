import React, { Component } from 'react'
import cn from 'classnames';
import Header from './Header'
import Body from './Body'

import styles from './layout.less'

class Section extends Component {
  render() {
    const containerClassNames = cn(styles.section, {
      'no-select': this.props.appState.get('dragging')
    });

    return (
      <div className={containerClassNames}>
        <Header { ...this.props } />
        <Body {...this.props} />
      </div>
    )
  }
}

export default Section;
