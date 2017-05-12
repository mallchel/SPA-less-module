import React from 'react'
import { Redirect } from 'react-router-dom'

const NavRedirect = function({route, params, ...props}) {
  return (
    <Redirect to={link(route, params)}/>
  )
}

function link(route, params) {
  return route.path.split('/').map(path => {
    if(path[0]===':') {
      const paramName = path.slice(1);
      return params[paramName];
    }
    return path;
  }).join('/');
}

export default NavRedirect;
