import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import classNames from 'classnames'
import { DragSource } from 'react-dnd'
import _ from 'lodash'

import dndTargets from '../../configs/dndTargets'
import FIELD_TYPES from '../../configs/fieldTypes'
import dragAndDropActions from '../../actions/dragAndDropActions'
import fieldTypeIcons from '../../configs/fieldTypeIcons'
import trs from '../../getTranslations'
import styles from './fieldTypes.less'

const fieldNameByType = {};
_.forEach(FIELD_TYPES, (id, name) => fieldNameByType[id] = name.toLowerCase());


const typesWithMargin = {
  [FIELD_TYPES.CONTACT]: true,
  [FIELD_TYPES.RADIOBUTTON]: true,
  [FIELD_TYPES.STARS]: true
};

const dragSource = DragSource(dndTargets.FIELD_TYPE, {
  beginDrag(props, monitor, component) {
    let item = { fieldType: component.props.type };
    dragAndDropActions.beginDrag(dndTargets.FIELD_TYPE, item);
    return item;
  },
  endDrag() {
    dragAndDropActions.endDrag();
  }
}, function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
});

const FieldTypesItem = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    type: React.PropTypes.string.isRequired
  },

  render() {
    const { connectDragSource, isDragging } = this.props;

    let classes = classNames({
      [styles.field]: true,
      'field-type--margin': typesWithMargin[this.props.type],
      [styles.section]: this.props.type === FIELD_TYPES.GROUP,
      'dragging': isDragging
    });

    return connectDragSource(
      <div className={classes}>
        <div className={styles.fieldIcon}>
          <div className={'anticon-icon ' + (fieldTypeIcons[this.props.type] || 'programing-21')}></div>
        </div>
        <div className={styles.fieldIconBorder} />
        <span className={styles.fieldText}>
          {trs(`fieldTypes.${fieldNameByType[this.props.type]}.name`)}
        </span>
      </div>
    );
  }

});

export default dragSource(FieldTypesItem);


