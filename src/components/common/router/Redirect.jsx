import React from 'react'
import { Redirect, Route } from 'react-router-dom'

const NavRedirect = function ({ route, params, ...props }) {
  return (
    <Route>
      {globalRoute => {
        const href = link(globalRoute, route, params);
        return <span>{href}</span>
      }}
    </Route>
  );


  return (
    <Route children={globalRoute => {
      const href = link(globalRoute, route, params);
      {/*<Redirect to={href} />*/ }
      return (
        <span>{href}</span>
      )
    }} />
  )
}

function link(globalRoute, route, params) {
  const globalParams = (globalRoute.match && globalRoute.match.params) || {};
  console.log(globalRoute)
  return route.path.split('/').map(path => {
    if (path[0] === ':') {
      const paramName = path.slice(1);
      return params[paramName] || globalParams[paramName];
    }
    return path;
  }).join('/');
}

export default NavRedirect;
