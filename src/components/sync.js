import { matchPath } from 'react-router'
import routes from '../routes'

export default function syncHistoryWithStore(history, store) {
  console.log(history)
  // Whenever location changes, dispatch an action to get it in the store
  const handleLocationChange = (location = history.location) => {
    for (let route in routes) {
      const match = matchPath(location.pathname, {
        path: routes[route].path,
        exact: true,
        strict: false
      });
      if (match) {
        // Tell the store to update by dispatching an action
        store.set('routeParams', match)
        break;
      }
    }
  }

  handleLocationChange()

  history.listen(handleLocationChange);

  return history;
}
