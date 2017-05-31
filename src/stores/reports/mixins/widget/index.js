import Immutable from 'immutable';

import { getBoardKey } from '../board/getKey';
import * as layout from '../layout';

export * from './values';
export * from './totals';

function getWidgetsKey(store, boardId) {
  const boardsKey = getBoardKey(store, boardId);

  if (!boardsKey) {
    return false;
  }

  boardsKey.push('widgets');
  return boardsKey;
}

function getWidgetKey(store, boardId, { id, uid }) {
  const widgetsKey = getWidgetsKey(store, boardId);

  if (!widgetsKey) {
    return false;
  }

  const key = [...widgetsKey, 'list'];
  const wIndex = (store.getIn(key) || Immutable.List()).findIndex(w => (
    uid && w.get('uid') === uid
    || id && w.get('id') === id
  ));

  if (wIndex === -1) {
    return false;
  }

  key.push(wIndex);
  return key;
}

export function getWidgets({ boardId }) {
  const widgetsKey = getWidgetsKey(this, boardId);

  if (!widgetsKey) {
    throw new Error('before load boards')
  }

  this.setIn([...widgetsKey, 'loading'], true);
  this.changed();
}

export function getWidgetsReady(widgets, { boardId }) {
  const widgetsKey = getWidgetsKey(this, boardId);

  if (!widgetsKey) {
    return;
  }

  // i don't know why, but sometimes this code is down
  this.setIn(widgetsKey, (this.getIn(widgetsKey) || Immutable.Map()).merge({
    loading: false,
    list: Immutable.fromJS(widgets.map(w => {
      w.uid = w.id;
      return w;
    }))
  }));
}

export function createWidget({ boardId }, widget) {
  const widgetsKey = getWidgetsKey(this, boardId);

  if (!widgetsKey) {
    return;
  }

  const key = [...widgetsKey, 'list'];
  this.setIn(key, this.getIn(key).push(widget));

  const boardKey = getBoardKey(this, boardId);
  const grid = this.getIn([...boardKey, 'grid']);
  this.updateBoard({ boardId }, {
    grid: layout.correctGrid(grid && grid.toJS() || {}, this.getIn([...boardKey, 'widgets', 'list']))
  });

  this.changed();
}

export function createWidgetCompleted({ id }, { boardId }, widget) {
  const uid = widget.get('uid');
  const key = getWidgetKey(this, boardId, { uid });

  if (!key) {
    return;
  }

  this.setIn(key, this.getIn(key).merge({ id }));

  const boardKey = getBoardKey(this, boardId);
  this.updateBoardGrid(boardId, this.getIn([...boardKey, 'grid']).toJS());

  this.changed();
}

export function updateWidget({ boardId, widgetId }, widget) {
  const key = getWidgetKey(this, boardId, { id: widgetId });

  if (!key) {
    return;
  }

  this.setIn(key, this.getIn(key).merge({ updating: true }));
  this.changed();
}

export function updateWidgetCompleted(data, { boardId, widgetId }, widget) {
  const key = getWidgetKey(this, boardId, { id: widgetId });

  if (!key) {
    return;
  }

  this.setIn(key, this.getIn(key).merge(widget));
  this.changed();
}

export function deleteWidget({ boardId, widgetId }) {
  const key = getWidgetKey(this, boardId, { id: widgetId });

  if (!key) {
    return;
  }

  this.deleteIn(key);
  this.changed();
}
