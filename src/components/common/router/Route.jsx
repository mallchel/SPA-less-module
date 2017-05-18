import React from 'react'
import { Route } from 'react-router-dom'

const NavRoute = function ({ component: Component, route, exact, ...props }) {
  return (
    <Route
      exact={exact}
      path={route}
      {...props}
      render={props => {
        return (
          <Component {...props} />
        )
      }} />
  )
}

export default NavRoute;
