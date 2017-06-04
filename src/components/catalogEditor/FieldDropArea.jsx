import _ from 'lodash';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import classNames from 'classnames';
import { DropTarget } from 'react-dnd';

import dndTargets from '../../configs/dndTargets';
import editorActions from '../../actions/editorActions';
import router from '../../router';
const log = require('debug')('CRM:Component:FieldDropArea');

const dropTarget = DropTarget([dndTargets.FIELD_TYPE, dndTargets.FIELD], {
  drop: function (props, monitor, component) {
    const item = monitor.getItem();
    editorActions.dropField(router.currentParams.sectionId, item.fieldIndex, item.fieldType, component.props.prevFieldIndex);
  },
  canDrop: function canDrop(props, monitor) {
    return !props.disabled;
  }
}, function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
});

const FieldDropArea = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    prevFieldIndex: React.PropTypes.number.isRequired,
    disabled: React.PropTypes.bool
  },

  render() {
    const { connectDropTarget, isOver } = this.props;

    let classes = classNames('field-drop-area', {
      hovering: !this.props.disabled && isOver
    });

    return connectDropTarget(
      <div className={classes} >
        <div></div>
      </div>
    );
  }

});

export default dropTarget(FieldDropArea);
