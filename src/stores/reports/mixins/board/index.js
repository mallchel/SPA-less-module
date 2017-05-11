import _ from 'lodash';
import Immutable from 'immutable';

import apiActions from '../../../../actions/apiActions';

import * as layout from '../layout';
import {BOARDS_PREFIX, getBaordKey} from './getKey';

export function getBoards() {
  this.setIn([...BOARDS_PREFIX, 'loading'], true);
  this.changed();
}

export function getBoardsCompleted(boards, params, data, {catalogId}) {
  if (this.getIn(['currentCatalog', 'id']) != catalogId) {
    return;
  }

  this.setIn([...BOARDS_PREFIX, 'loading'], false);
  this.setIn([...BOARDS_PREFIX, 'loaded'], true);

  const list = this.getIn([...BOARDS_PREFIX, 'list']);
  this.setIn([...BOARDS_PREFIX, 'list'], list.mergeDeep(boards));
  this.changed();
}

export function getBoard({boardId}) {
  this.updateBoard({boardId}, {
    loading: true,
    beginUpdate: Date.now()
  });
  this.changed();
}

export function getBoardReady(board, {boardId}, data) {
  const {catalogId} = board;

  if (this.getIn(['currentCatalog', 'id']) != catalogId) {
    return;
  }

  this.updateBoard({boardId}, {
    ...board,
    loading: false,
    loaded: true,
    updateTime: Date.now(),
    grid: layout.toGrid(board.layouts, this.getIn([...getBaordKey(this, boardId), 'widgets', 'list']))
  });
}

export function createBoardCompleted({id}, params, {catalogId, ...data}) {
  if (this.getIn(['currentCatalog', 'id']) != catalogId) {
    return;
  }

  const list = this.getIn([...BOARDS_PREFIX, 'list']);
  this.setIn([...BOARDS_PREFIX, 'list'], list.push(Immutable.fromJS({
    id,
    catalogId,
    ...data
  })));
  this.changed();
}

export function updateBoard({boardId}, board) {
  const key = getBaordKey(this, boardId);
  this.setIn(key, this.getIn(key).merge(board));
  this.changed();
}

export function updateBoardGrid(boardId, grid) {
  const key = getBaordKey(this, boardId);
  const current = this.getIn([...key, 'layouts']);
  const widgets = this.getIn([...key, 'widgets', 'list']);
  const layouts = layout.fromGrid(grid, widgets);

  this.updateBoard({boardId}, {grid});

  if (!layout.isEqual(current && current.toJS(), layouts)) {
    apiActions.updateBoard({boardId}, {layouts});
  }
}

export function updateBoardSystem(boardId, data) {
  this.updateBoard({boardId}, data)

}

export function getBoardWithWidgets(boardId) {
  apiActions.getBoard({boardId});
  apiActions.getWidgets({boardId});
}
