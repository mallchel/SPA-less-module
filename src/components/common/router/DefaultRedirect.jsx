import React from 'react'
import NavRoute from './Route'
import NavRedirect from './Redirect'

const DefaultRedirect = function ({ route, params, object, ...props }) {
  return <NavRoute route={route}>
    {
      ({ match }) => {
        if (!(match && match.params[params]) && object) {
          return <NavRedirect route={route} params={{ [params]: object.get('id') }} />
        }
        return null;
      }}
  </NavRoute>
}

export default DefaultRedirect;
