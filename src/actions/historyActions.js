import Reflux from 'reflux';


export default {
  loadHistory: Reflux.createAction({sync: false}),
  createComment: Reflux.createAction({sync: false}),
  clearHistory: Reflux.createAction({sync: false}),
  setFilter: Reflux.createAction({sync: false}),
};
