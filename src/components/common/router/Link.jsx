import React from 'react'
import { Route } from 'react-router-dom'
import getLink from './getLink'

const NavLink = function ({ render, route, params, ...props }) {
  return (
    <Route>
      {({ location }) => {
        const link = getLink(location, route, params);
        return (
          <Route path={link}>
            {({ match, history }) => {
              const isActive = !!match;
              return render({ ...props, history, isActive, link });
            }}
          </Route>
        )
      }}
    </Route>
  )
}

export default NavLink;
