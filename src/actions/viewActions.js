import Reflux from 'reflux';


export default {
  selectView: Reflux.createAction({sync: true}),
  preGetView: Reflux.createAction({sync: true}),
  createNewView: Reflux.createAction({sync: true}),
  saveView: Reflux.createAction({sync: true}),
  setField: Reflux.createAction({sync: true}),
  setViewProperty: Reflux.createAction({sync: true}),
};
