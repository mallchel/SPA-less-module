import Reflux from 'reflux';


export default {

  updateFieldFilter: Reflux.createAction({
    sync: true
  }),

  searchByText: Reflux.createAction({
    sync: true
  }),

  applyFiltersFromView: Reflux.createAction({sync: true}),

  removeAllFilterCatalog: Reflux.createAction({sync: true})
};
