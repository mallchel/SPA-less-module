import { DragSource, DropTarget } from 'react-dnd'
import dndTargets from '../../../../../configs/dndTargets'
import dragAndDropActions from '../../../../../actions/dragAndDropActions'

export const dragSource = DragSource(dndTargets.SIDEBAR_ITEM, {
  beginDrag(props) {
    let item = {
      id: props.item.get('id'),
      dragType: props.dragType,
    };
    return item;
  },
  endDrag(props) {
    dragAndDropActions.endDrag();
    props.onDragEnd(props.item.get('id'));
  },
  canDrag(props, monitor) {
    return props.canDrag;
  }
}, function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  }
});

export const dropTarget = DropTarget(dndTargets.SIDEBAR_ITEM, {
  hover(props, monitor) {
    if (monitor.canDrop()) {
      const item = monitor.getItem();
      props.onMoveItem(item.id, props.item.get('id'));
    }
  },
  canDrop(props, monitor) {
    return props.dragType === monitor.getItem().dragType
  }
}, function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget()
  };
});
