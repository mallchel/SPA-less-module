import Reflux from 'reflux';
import debug from 'debug';
import dragAndDropActions from '../actions/dragAndDropActions';

const log = debug('CRM:Store:dndStore');

const dndStore = Reflux.createStore({

  init() {
    this.name = 'dndStore';
    this.listenTo(dragAndDropActions.beginDrag, this.onBeginDrag);
    this.listenTo(dragAndDropActions.endDrag, this.onEndDrag);
  },

  onBeginDrag(dropType, dropInfo) {
    log('onBeginDrag', dropType, dropInfo);
    this.state.setFromJS('dropType', dropType);
    this.state.setFromJS('dropInfo', dropInfo);

    this.trigger();
  },

  onEndDrag() {
    if ( this.state.get('dropType') || this.state.get('dropInfo') ) {
      this.state.setFromJS('dropType', null);
      this.state.setFromJS('dropInfo', null);

      this.trigger();
    }
  }

});


export default dndStore;
