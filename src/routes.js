class Route {
  constructor({ path }) {
    this.path = path
  }
}

const relativeRoutes = {
  section: { path: '/section/:sectionId' },
  catalog: { parent: 'section', path: '/catalog/:catalogId' },
  view: { parent: 'catalog', path: '/view/:viewId' },

  // records
  records: { parent: 'view', path: '/records' },
  addRecord: { parent: 'records', path: '/add' },
  record: { parent: 'records', path: '/:recordId' },

  // history
  history: { parent: 'view', path: '/history' },

  // reports
  reports: { parent: 'view', path: '/reports' },
  board: { parent: 'reports', path: '/board/:boardId' },
};

const absoluteRoutes = {};

function getAbsolutePath(routeName) {
  const route = relativeRoutes[routeName];
  const parentPath = route.parent ? getAbsolutePath(route.parent) : '';
  return parentPath + route.path;
}

Object.keys(relativeRoutes).forEach(routeName => {
  absoluteRoutes[routeName] = new Route({
    path: getAbsolutePath(routeName),
  })
});

export default absoluteRoutes;
