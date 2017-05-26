import React, { Component } from 'react'
import PropTypes from 'prop-types'
import NavRoute from '../../../../../../../common/router/Route'
import routes from '../../../../../../../../routes'
// import Records from './Records'
import Records from './Records/Records'

class ViewBody extends Component {
  static propTypes = {
    catalog: PropTypes.object
  }
  render() {
    return (
      <div>
        <NavRoute route={routes.records} render={props => {
          return this.props.catalog ?
            <Records catalog={this.props.catalog} />
            : null
        }} />
        {/*<NavRoute route={routes.reports} render={props => {
          return null
        }} />
        <NavRoute route={routes.history} render={props => {
          return null
        }} />*/}
      </div>
    )
  }
}

export default ViewBody;
