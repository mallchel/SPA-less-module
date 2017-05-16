import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { DropTarget } from 'react-dnd';
import classNames from 'classnames';

import trs from '../../../getTranslations';
import dndTargets from '../../../configs/dndTargets';

const log = require('debug')('CRM:Component:catalogData:Import:StepFieldsDropArea');

const dropTarget = DropTarget(dndTargets.IMPORT_FIELD, {
  drop(props, monitor) {
    const item = monitor.getItem();
    props.onDropField(props.catalogColIndex, item.fileColIndex);
  },
  canDrop(props) {
    return !props.disabled;
  }
}, function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget()
  };
});

const StepFieldsDropArea = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    catalogColIndex: React.PropTypes.number,
    disabled: React.PropTypes.bool,
    onDropField: React.PropTypes.func
  },

  getInitialState() {
    return {
      disabled: false,
      file: null,
      id: null
    };
  },

  render() {
    const { connectDropTarget, isDragging, isHovering } = this.props;

    var classes = classNames({
      'import-fields__col-wrapper': true,
      'import-fields__col-wrapper--hovering': !this.state.disabled && isHovering,
      'import-fields__col-wrapper--dragging': !this.state.disabled && isDragging
    });

    return connectDropTarget(
      <div className={classes}>
        {this.props.children}
      </div>
    );
  }

});

export default dropTarget(StepFieldsDropArea);
