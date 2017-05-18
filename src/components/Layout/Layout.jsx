import React, { Component } from 'react'
import cn from 'classnames';
import HeaderSection from './header/HeaderSection'
import Content from './content/Content'
import styles from './layout.less'

class Section extends Component {
  render() {
    const containerClassNames = cn(styles.section, {
      'no-select': this.props.appState.get('dragging')
    });

    return (
      <div className={containerClassNames}>
        <HeaderSection { ...this.props } />
        <Content {...this.props} />
      </div>
    )
  }
}

export default Section;
