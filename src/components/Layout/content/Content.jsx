import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import HeaderCatalog from './HeaderCatalog'
import Body from './body/Body'
import styles from './content.less'

class Content extends Component {
  render() {
    return (
      <div className={styles.container}>
        <Route path='/section/:sectionId' render={props => (
          <HeaderCatalog { ...this.props } {...props} />
        )} />
        <Body { ...this.props } />
      </div>
    )
  }
}

export default Content;
