import React from 'react'
import { Route } from 'react-router-dom'

const NavRoute = function ({ render, route, exact, ...props }) {
  return (
    <Route
      exact={exact}
      path={route.path}
      {...props}
      render={props => {
        return render({...props});
      }} />
  )
}

export default NavRoute;
