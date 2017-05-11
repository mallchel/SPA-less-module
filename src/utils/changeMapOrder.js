export default function changeMapOrder(collection, id, newIndex) {
  let oldIndex = collection.getIn([id, 'index']);

  collection = collection.map(c=> {
    let idx = c.get('index');
    if ( newIndex < oldIndex ) {
      if ( idx >= newIndex && idx < oldIndex ) {
        c = c.set('index', idx + 1);
      }
    } else {
      if ( idx > oldIndex && idx <= newIndex ) {
        c = c.set('index', idx - 1);
      }
    }

    return c;
  });

  collection = collection.setIn([id, 'index'], newIndex);

  return collection;
};
