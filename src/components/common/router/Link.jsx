import React from 'react'
import { Route } from 'react-router-dom'

const NavLink = function ({ component: Component, params, route, ...props }) {
  return (
    <Route children={globalRoute => {
      const href = link(globalRoute, route, params);
      return (
        <Route
          path={href}
          children={({ match }) => {
            const isActive = !!match
            return (
              <Component {...props} isActive={isActive} link={href} />
            )
          }}
        />
      )
    }} />
  )
}

function link(globalRoute, route, params) {
  const globalParams = globalRoute.match.params;

  return route.path.split('/').map(path=> {
    if (path[0] === ':') {
      const paramName = path.slice(1);
      return params[paramName] || globalParams[paramName];
    }

    return path;
  }).join('/');
}

export default NavLink;
