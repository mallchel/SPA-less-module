import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import getLink from './getLink'

const NavRedirect = function ({ route, params, ...props }) {
  return (
    <Route children={({ location }) => {
      const href = getLink(location, route, params);
      return <Redirect to={href} />
    }} />
  )
}

export default NavRedirect;
