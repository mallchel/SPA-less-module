import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import { DragSource } from 'react-dnd'
import _ from 'lodash'
import { Input, Checkbox } from 'antd'

import dndTargets from '../../configs/dndTargets'
import dragAndDropActions from '../../actions/dragAndDropActions'
import FieldRemoveCross from './FieldRemoveCross'
import fieldTypeIcons from '../../configs/fieldTypeIcons'
import editorActions from '../../actions/editorActions'
import FIELD_TYPES from '../../configs/fieldTypes'
import autosize from 'autosize'
import styles from './catalogEditor.less'

const trs = require('../../getTranslations');

const fieldNameByType = {};
_.forEach(FIELD_TYPES, (id, name) => fieldNameByType[id] = name.toLowerCase());

const dragSource = DragSource(dndTargets.FIELD, {
  beginDrag(props, monitor, component) {
    let item = { fieldId: component.props.field.get('id'), fieldIndex: component.props.fieldIndex, state: component.state };
    dragAndDropActions.beginDrag(dndTargets.FIELD, item);
    return item;
  },
  endDrag() {
    dragAndDropActions.endDrag();
  }
}, function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  }
});

const ApiOnlyIcon = function () {
  return (
    <span className="anticon-icon edition-55 m-text_light" />
  )
};

const FieldWrapper = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    field: React.PropTypes.object.isRequired,
    fieldIndex: React.PropTypes.number.isRequired,
    sectionId: React.PropTypes.string.isRequired,
    disabled: React.PropTypes.bool,
    needFocusOnInputNameCallback: React.PropTypes.func
  },

  getInitialState() {
    return {
      value: this.props.field.get('name'),
      required: this.props.field.get('required'),
      hint: this.props.field.get('hint'),
      iconHovered: false,
      settingsOpened: false
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.field.get('name'),
      required: nextProps.field.get('required'),
      hint: nextProps.field.get('hint')
    });
  },

  onChange(e) {
    let newValue = e.target.value;
    this.setState({
      value: newValue
    });
    this.setFieldNameDebounce(newValue);
  },

  onChangeIsRequired(e) {
    const isRequired = e.target.checked;
    this.setState({
      required: isRequired,
    });
    this.setFieldRequireDebounce(isRequired);
  },

  onMouseEnterIcon(e) {
    this.setState({
      iconHovered: true
    });
  },

  onMouseLeaveIcon(e) {
    this.setState({
      iconHovered: false
    });
  },

  componentDidMount() {
    this.setFieldHintDebounce = _.debounce((hint) => {
      editorActions.setFieldHint(this.props.sectionId, this.props.fieldIndex, hint);
    }, 200);
    this.setFieldNameDebounce = _.debounce((newValue) => {
      editorActions.setFieldName(this.props.sectionId, this.props.fieldIndex, newValue);
    }, 200);
    this.setFieldRequireDebounce = _.debounce((isRequired) => {
      editorActions.setFieldRequired(this.props.sectionId, this.props.fieldIndex, isRequired);
    }, 200);
    if (this.refs.textArea) {
      autosize(ReactDOM.findDOMNode(this.refs.textArea));
    }
  },

  onChangeHint(e) {
    let hint = e.target.value;
    this.setState({ hint });

    this.setFieldHintDebounce(hint);
  },

  componentWillUpdate(nextProps) {
    if (nextProps.needFocusOnInputNameCallback && (document.activeElement != ReactDOM.findDOMNode(this.refs.inputName))) {
      setTimeout(() => {
        ReactDOM.findDOMNode(this.refs.inputName).focus();
        ReactDOM.findDOMNode(this.refs.inputName).select();
        nextProps.needFocusOnInputNameCallback();
      }, 1);
    }
  },

  toggleFieldSettings() {
    this.setState({ settingsOpened: !this.state.settingsOpened });
  },

  apiOnlyChanged(e) {
    const { checked } = e.target;
    editorActions.setFieldApiOnly(this.props.sectionId, this.props.fieldIndex, checked);
  },

  render() {
    const { connectDragSource, connectDragPreview, isDragging, field } = this.props;
    const { settingsOpened, value } = this.state;

    let fieldType = field.get('type');
    let classes = classNames(styles.field, { [styles.fieldSection]: fieldNameByType[fieldType] === 'group' }, {
      'field--draggable-disabled': this.props.draggableDisabled,
      'dragging': isDragging
    });
    const notGroup = (fieldType != 'group'); // Данный компонент не является заголовком секции
    return connectDragPreview(
      <div className={classes}>

        <div className={styles.fieldLeftSide} style={notGroup ? null : { width: '100%' }}>
          {connectDragSource(
            <div className={styles.fieldIcon}>
              <span className={classNames('anticon-icon ' + fieldTypeIcons[fieldType])}//{'field-left-side__icon anticon-icon ' + fieldTypeIcons[fieldType]}
                onMouseEnter={this.onMouseEnterIcon}
                onMouseLeave={this.onMouseLeaveIcon} />
            </div>
          )}
          <div className={styles.fieldLeftSideName}>
            <Input
              ref="inputName"
              disabled={this.props.disabled}
              placeholder={trs(`fieldTypes.${fieldNameByType[fieldType]}.namePlaceholder`)}
              type="text"
              onChange={this.onChange}
              value={value} />

            {notGroup && (
              settingsOpened
                ? (
                  <ul className={styles.fieldConfigOpened}>
                    <li>
                      <div>
                        <div>{trs('catalogEditor.field.config.code.title')}</div>
                        <Input disabled value={field.get('id')} />
                      </div>
                    </li>
                    <li className={styles.fieldConfigApiOnly}>
                      <div>{trs('catalogEditor.field.config.edit.title')}</div>
                      <div>
                        <Checkbox checked={!!field.get('apiOnly')} onChange={this.apiOnlyChanged}>{trs('catalogEditor.field.config.edit.apiOnly')}</Checkbox>
                        <ApiOnlyIcon />
                      </div>
                    </li>
                  </ul>
                )
                : (
                  <div className={styles.fieldConfigClosed}>
                    <small>
                      {field.get('id') && (
                        <span>
                          {trs('catalogEditor.field.config.code.titleShort')} {field.get('id')}
                        </span>
                      )}
                      {field.get('apiOnly') && <span>&nbsp;<ApiOnlyIcon /></span>}
                    </small>
                  </div>
                )
            )}
          </div>
          {
            notGroup && (
              <div className={styles.fieldLeftSideOptions}>
                <span className={settingsOpened ? styles.fieldLeftSideSettingOpened : styles.fieldLeftSideSetting}
                  onClick={this.toggleFieldSettings}>
                  <span className="anticon-icon setting-13" />
                </span>
                <input
                  ref="isRequired"
                  style={{ display: 'none' }}
                  type="checkbox"
                  id={"required_" + this.props.fieldIndex}
                  onChange={this.onChangeIsRequired}
                  checked={this.state.required}
                />
                <label className={this.state.required ? styles.fieldLabelRequired : styles.fieldLabel} htmlFor={"required_" + this.props.fieldIndex} title={trs(`isRequired`)}>
                  <div className="anticon-icon keyboard-10"></div>
                </label>
              </div>
            )
          }
        </div>

        <div className={styles.fieldRightSide} style={notGroup ? null : { display: 'none' }}>
          {this.props.children}

          <aside className={styles.fieldHint}>
            <Input
              type="textarea"
              rows="1"
              placeholder={trs('catalogEditor.namePlaceholderHint')}
              ref="textArea"
              value={this.state.hint}
              onChange={this.onChangeHint}
              style={{ resize: 'none' }}
              className={styles.fieldHintInput}
            />
          </aside>
        </div>

        {!this.props.hideCross && !this.props.disabled ?
          <FieldRemoveCross
            sectionId={this.props.sectionId}
            fieldIndex={this.props.fieldIndex}
            fieldId={field.get('id')} /> : null}

      </div>
    );

  }

});

export default dragSource(FieldWrapper);
