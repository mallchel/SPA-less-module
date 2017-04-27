import React, { Component } from 'react'
import HeaderCatalog from './HeaderCatalog'
import Body from './body/Body'

class Catalog extends Component {
  render() {
    return (
      <div className="container--padding-horizontal" style={{ background: 'rgb(235, 237, 240)', height: '100%' }}>
        <HeaderCatalog { ...this.props } />
        <Body { ...this.props } />
        {/*<NavRoute route={routes.catalog} component={Body} />*/}
      </div>
    )
  }
}

export default Catalog;
