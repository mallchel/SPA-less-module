import React from 'react'
import { Route } from 'react-router-dom'
import _ from 'lodash'
// import NavRoute from './Route'
import NavRedirect from './Redirect'
import getRouteParams from './getRouteParams'
import { matchPath } from 'react-router'

const StateRedirect = function ({ route, params, object, ...props }) {
  console.log(route, params)
  return (
    <Route children={({ location }) => {
      const { route: currentRoute, match } = getRouteParams(location) || {};
      const _match = currentRoute && matchPath(currentRoute.path, {
        path: route.path,
        exact: false,
        strict: false
      });
      const fullParams = _.assign({}, match && match.params, params);
      return <NavRedirect route={_match && route ? currentRoute : route} params={fullParams} />
    }} />
  )
}

export default StateRedirect;
