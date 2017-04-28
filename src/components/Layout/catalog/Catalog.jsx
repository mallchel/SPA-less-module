import React, { Component } from 'react'
import HeaderCatalog from './HeaderCatalog'
import Body from './body/Body'
import styles from './catalog.less'

class Catalog extends Component {
  render() {
    return (
      <div className={styles.container}>
        <HeaderCatalog { ...this.props } />
        <Body { ...this.props } />
        {/*<NavRoute route={routes.catalog} component={Body} />*/}
      </div>
    )
  }
}

export default Catalog;
