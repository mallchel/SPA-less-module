import React, { Component } from 'react'
import PropTypes from 'prop-types'
import NavRoute from '../../../../../../../common/router/Route'
import routes from '../../../../../../../../routes'
import Records from './Records'
import Reports from '../../../../../../../Reports'
import History from '../../../../../../../History'

class ViewBody extends Component {
  static propTypes = {
    catalog: PropTypes.object,
    viewId: PropTypes.string
  }
  render() {
    let viewId = this.props.viewId;
    if (viewId == '$new') {
      viewId = '0';
    }
    const catalog = this.props.catalog;

    return (
      <div>
        <NavRoute route={routes.records} render={props => {
          return catalog ?
            <Records
              catalog={catalog}
              viewId={viewId}
            />
            :
            null
        }} />
        <NavRoute route={routes.reports} render={props => {
          return catalog ?
            <Reports
              catalog={catalog}
            />
            :
            null
        }} />
        <NavRoute route={routes.history} render={props => {
          return catalog ?
            <History
              catalog={catalog}
            />
            :
            null
        }} />
      </div>
    )
  }
}

export default ViewBody;
