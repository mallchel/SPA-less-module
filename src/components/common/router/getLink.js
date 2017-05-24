import getRouteParams from './getRouteParams'

export default function link(location, route, params) {
  const { match } = getRouteParams(location) || { match: { params: {} } };

  return route.path.split('/').map(path => {
    if (path[0] === ':') {
      const paramName = path.slice(1);
      return params[paramName] || match.params[paramName];
    }
    return path;
  }).join('/');
}
