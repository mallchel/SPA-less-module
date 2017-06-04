import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import { DragSource } from 'react-dnd'
import _ from 'lodash'

import dndTargets from '../../configs/dndTargets'
import dragAndDropActions from '../../actions/dragAndDropActions'
import FieldRemoveCross from './FieldRemoveCross'
import fieldTypeIcons from '../../configs/fieldTypeIcons'
import editorActions from '../../actions/editorActions'
import FIELD_TYPES from '../../configs/fieldTypes'
import autosize from 'autosize'

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
    <span className="icon icon--edition-55 m-text_light" />
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
    let isRequired = e.target.checked;
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
    let classes = classNames('field field--type-' + fieldNameByType[fieldType], {
      'field--draggable-disabled': this.props.draggableDisabled,
      'dragging': isDragging
    });
    let notGroup = (fieldType != 'group'); // Данный компонент не является заголовком секции
    return connectDragPreview(
      <div className={classes}>

        <div className="field__left-side field-left-side">
          {connectDragSource(
            <div className="field-left-side__left">
              <span className={'field-left-side__icon icon icon--' + fieldTypeIcons[fieldType]}
                onMouseEnter={this.onMouseEnterIcon}
                onMouseLeave={this.onMouseLeaveIcon} />
            </div>
          )}
          <div className="field-left-side__center field-left-side-center">
            <input
              ref="inputName"
              disabled={this.props.disabled}
              placeholder={trs(`fieldTypes.${fieldNameByType[fieldType]}.namePlaceholder`)}
              className="w100"
              type="text"
              onChange={this.onChange}
              value={value} />

            {notGroup && (
              settingsOpened
                ? (
                  <ul className="field-left-side-center__config field-left-side-center__config--opened">
                    <li className="field-left-side-center-section">
                      <label>
                        <div className="field-left-side-center-section__header">{trs('catalogEditor.field.config.code.title')}</div>
                        <input type="text" className="w100" disabled value={field.get('id')} />
                      </label>
                    </li>
                    <li className="field-left-side-center-section">
                      <div className="field-left-side-center-section__header">{trs('catalogEditor.field.config.edit.title')}</div>
                      <label className="checkbox">
                        <input type="checkbox" checked={field.get('apiOnly')} onChange={this.apiOnlyChanged} />
                        {trs('catalogEditor.field.config.edit.apiOnly')}&nbsp;&nbsp;<ApiOnlyIcon />
                      </label>
                    </li>
                  </ul>
                )
                : (
                  <div className="m-text_light field-left-side-center__config">
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
              <div className="field-left-side__right field-left-side-options">
                <span className={'field-left-side-options__settings ' + (settingsOpened ? 'field-left-side-options__settings--opened' : '')}
                  onClick={this.toggleFieldSettings}>
                  <span className="icon icon--setting-13" />
                </span>
                <input
                  ref="isRequired"
                  className="field-left-side-options__is-required"
                  type="checkbox"
                  id={"required_" + this.props.fieldIndex}
                  onChange={this.onChangeIsRequired}
                  checked={this.state.required}
                />
                <label className="field-left-side-options__is-required-label" htmlFor={"required_" + this.props.fieldIndex} title={trs(`isRequired`)}>
                  <div className="icon icon--keyboard-10"></div>
                </label>
              </div>
            )
          }
        </div>

        <div className="field__right-side">
          {this.props.children}

          <aside className="field_hint">
            <textarea
              rows="1"
              placeholder={trs('catalogEditor.namePlaceholderHint')}
              ref="textArea"
              value={this.state.hint}
              className="field_hint__input"
              onChange={this.onChangeHint} />
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
