import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import classNames from 'classnames';
import { DragSource } from 'react-dnd';

import trs from '../../../getTranslations';
import dndTargets from '../../../configs/dndTargets';
import dragAndDropActions from '../../../actions/dragAndDropActions';

const log = require('debug')('CRM:Component:catalogData:Import:StepFieldsItem');

const dragSource = DragSource(dndTargets.IMPORT_FIELD, {
  beginDrag(props) {
    return {
      fileColIndex: props.fileColIndex
    };
  },
  canDrag(props) {
    return props.canDrag;
  }
}, function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
});

const StepFieldsItem = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    fileColIndex: React.PropTypes.number,
    catalogColIndex: React.PropTypes.number,
    name: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    canDrag: React.PropTypes.bool,
    onRemoveCatalogCol: React.PropTypes.func,
    canRemove: React.PropTypes.bool
  },

  onClickRemove() {
    if ( this.props.canRemove ) {
      this.props.onRemoveCatalogCol(this.props.catalogColIndex);
    }
  },

  render() {
    const { connectDragSource, isDragging, isHovering } = this.props;

    var classes = classNames({
      'import-fields__col-content': true,
      'import-fields__col-content--disabled': this.props.disabled,
      'import-fields__col-content--draggable': this.props.canDrag,
      'import-fields__col-content--removable': this.props.canRemove,
      'modal-import__drop--hovering': !this.state.disabled && isHovering,
      'import-fields__col-content--dragging': !this.state.disabled && isDragging
    });

    return connectDragSource(
      <div className={classes}>
        <span>{this.props.name}</span>
        { this.props.canRemove ? <div className="m-close" onClick={this.onClickRemove} /> : null }
      </div>
    );
  }

});

export default dragSource(StepFieldsItem);
