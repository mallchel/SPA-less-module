import React, { Component } from 'react'
import PropTypes from 'prop-types'
import NavRoute from '../../../../../../../common/router/Route'
import routes from '../../../../../../../../routes'
import Records from './Records'
import Reports from './../../../../../../../Reports'

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
            :
            null
        }} />
        <NavRoute route={routes.reports} render={props => {
          return this.props.catalog ?
            <Reports catalog={this.props.catalog} />
            :
            null
        }} />
        {/*<NavRoute route={routes.history} render={props => {
          return null
        }} />*/}
      </div>
    )
  }
}

export default ViewBody;
