import React, { Component } from 'react'
import HeaderSection from './header/HeaderSection'
import Content from './content/Content'
import styles from './layout.less'

class Section extends Component {
  render() {
    return (
      <div className={styles.section}>
        <HeaderSection { ...this.props } />
        <Content { ...this.props } />
      </div>
    )
  }
}

export default Section;
