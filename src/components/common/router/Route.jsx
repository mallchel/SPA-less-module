import React from 'react'
import { Route } from 'react-router-dom'

const NavRoute = function ({ route, ...props }) {
  return (
    <Route
      path={route.path}
      {...props}
    />
  )
}

export default NavRoute;
