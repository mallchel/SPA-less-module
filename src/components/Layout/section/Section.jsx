import React, { Component } from 'react'
import HeaderSection from './HeaderSection'
import Catalog from '../catalog/Catalog'
import style from './style.less'

class Section extends Component {
  render() {
    return (
      <div className={style.section}>
        <HeaderSection {...this.props} />
        <Catalog {...this.props} />
      </div>
    )
  }
}

export default Section;
