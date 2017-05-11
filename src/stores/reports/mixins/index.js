import actions from '../../../actions/apiActions'

import * as widgetMixins from './widget';
import * as boardMixins from './board';

export default {
  ...widgetMixins,
  ...boardMixins,

  init() {
    this.joinTrailing(actions.getBoard.completed, actions.getWidgets.completed, this.calcGrid);
  },

  calcGrid(getBoardArgs, getWidgetsArgs) {
    actions.getWidgets.ready(...getWidgetsArgs);
    actions.getBoard.ready(...getBoardArgs);
    this.changed();
  }
};
