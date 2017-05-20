import React from 'react'
import { Route } from 'react-router-dom'

const NavRoute = function ({ render, route, exact, ...props }) {
  return render ? (
    <Route
      exact={exact}
      path={route.path}
      {...props}
      render={props => {
        return render({ ...props });
      }} />
  )
    : (
      <Route
        exact={exact}
        path={route.path}
        {...props}
      />
    )
}

export default NavRoute;
