export const BOARDS_PREFIX = ['currentCatalog', 'boards'];

export function getBaordKey(store, boardId) {
  const key = [...BOARDS_PREFIX, 'list'];
  const boards = store.getIn(key);
  const boardIndex = boards && boards.findIndex(b=> b.get('id') === boardId);
  if (boardIndex === -1) {return  false;}
  key.push(boardIndex);
  return key;
}
