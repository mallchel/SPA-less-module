import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { matchPath } from 'react-router'
// import NavRoute from './Route'
// import NavRedirect from './Redirect'

const DefaultRedirect = function ({ route, path, object, ...props }) {
  return (
    <Route>
      {({ match, location }) => {
        const pathCheck = (match.url !== '/' ? match.url : '') + path + '/';
        const _match = matchPath(location.pathname, {
          path: pathCheck,
          exact: false,
          strict: false
        })

        if (!_match && object) {
          const parentPath = match.url.substr(-1) === "/" ? match.url.substr(0, -1) : match.url;
          const absolutePath = parentPath + '/' + route + '/' + object.get('id');
          return <Redirect to={absolutePath} />;
        } else {
          return null;
        }
      }}
    </Route>
  )

  // {/*<NavRoute route={route} globalMatch={match}>
  //   {({ match }) => {
  //     {/*if (!(match && match.params[params]) && object) {
  //       return <NavRedirect route={route} params={{ [params]: object.get('id') }} />
  //     }*/}
  //     return null;
  //   }}
  // </NavRoute>*/}
}

export default DefaultRedirect;
