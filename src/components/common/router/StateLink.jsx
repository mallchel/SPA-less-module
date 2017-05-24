import React from 'react'
import { Route } from 'react-router-dom'
import _ from 'lodash'
import NavLink from './Link'
import getRouteParams from './getRouteParams'
import { matchPath } from 'react-router'

const StateLink = function ({ render, params, route, ...props }) {
  return (
    <Route children={({ location }) => {
      const { route: currentRoute, match } = getRouteParams(location) || {};
      const _match = currentRoute && matchPath(currentRoute.path, {
        path: route.path,
        exact: false,
        strict: false
      });
      const fullParams = _.assign({}, match && match.params, params);
      return <NavLink render={render} route={_match && route ? currentRoute : route} params={fullParams} />
    }} />

  )
}

export default StateLink;
