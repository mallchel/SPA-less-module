import _ from 'lodash'
import React from 'react'
import classNames from 'classnames'
import { DragSource, DropTarget } from 'react-dnd'

import dndTargets from '../../../../../../../../../../configs/dndTargets'
import dragAndDropActions from '../../../../../../../../../../actions/dragAndDropActions'

const dragSource = DragSource(dndTargets.TABLE_FIELD, {
  beginDrag(props, monitor, component) {
    var item = { id: component.props.field.get('id') };
    dragAndDropActions.beginDrag(dndTargets.TABLE_FIELD, item);
    component.props.onDragStart(component.props.field.get('id'));
    return item;
  },
  endDrag(props, monitor, component) {
    dragAndDropActions.endDrag();
    component.props.onDragEnd(component.props.field.get('id'));
  }
}, function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
});

const dropTarget = DropTarget(dndTargets.TABLE_FIELD, {
  hover(props, monitor) {
    let item = monitor.getItem();
    props.moveItem(item.id, props.field.get('id'));
  }
}, function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget()
  };
});

const FieldConfigItem = React.createClass({
  propTypes: {
    field: React.PropTypes.object.isRequired,
    visible: React.PropTypes.bool.isRequired,
    onDragStart: React.PropTypes.func.isRequired,
    onDragEnd: React.PropTypes.func.isRequired,
    moveItem: React.PropTypes.func.isRequired,
    onChangeVisibility: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      visible: this.props.visible
    };
  },

  onClick() {
    this.setState({
      visible: !this.props.visible
    });
    this.props.onChangeVisibility(this.props.field.get('id'), !this.props.visible);
  },

  onChange(e) {
    this.setState({
      visible: e.target.checked
    });
    this.props.onChangeVisibility(this.props.field.get('id'), e.target.checked);
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      visible: nextProps.visible
    });
  },

  render() {
    const { connectDragSource, connectDropTarget, isDragging } = this.props;

    return _.flow(connectDropTarget, connectDragSource)(
      <div className={classNames({ 'field-config__item': true, 'dragging': isDragging })}>
        <div className="field-config__cont">
          <input className="field-config__checkbox" type="checkbox" onChange={this.onChange} checked={this.state.visible} />
        </div>
        <div className="field-config__cont" onClick={this.onClick}>
          <span className="field-config__text">{this.props.field.get('name')}</span>
        </div>
      </div>
    );
  }

});

export default _.flow(dropTarget, dragSource)(FieldConfigItem);
