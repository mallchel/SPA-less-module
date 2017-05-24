import routes from '../../../routes'
import { matchPath } from 'react-router'

export default function getRouteParams(location) {
  for (let key in routes) {
    const route = routes[key];
    const match = matchPath(location.pathname, {
      path: route.path,
      exact: true,
      strict: false
    });
    if (match) {
      return { route, match }
    }
  }
}
