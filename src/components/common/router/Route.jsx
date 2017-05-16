import React from 'react'
import { Route } from 'react-router-dom'

const NavRoute = function ({ component: Component, route, exact, ...props }) {
  return (
    <Route
      exact={exact}
      path={route}
      {...props}
      component={Component}
    >
    </Route>
  )
}

export default NavRoute;
