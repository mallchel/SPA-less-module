import React, { Component } from 'react'
import HeaderSection from './HeaderSection'
import Catalog from '../catalog/Catalog'
import styles from './section.less'

class Section extends Component {
  render() {
    return (
      <div className={styles.section}>
        <HeaderSection { ...this.props } />
        <Catalog { ...this.props } />
      </div>
    )
  }
}

export default Section;
