import React from 'react'

import NavRoute from './Route'
import NavRedirect from './Redirect'

const DefaultRedirect = function ({ route, object }) {
  return (
    <NavRoute route={route}>
      {({ match }) => {
        if (!(match && match.params.sectionId) && object) {
          return <NavRedirect route={route} params={{ sectionId: object.get('id') }} />
        }
        return null;
      }}
    </NavRoute>
  )
}

export default DefaultRedirect;
