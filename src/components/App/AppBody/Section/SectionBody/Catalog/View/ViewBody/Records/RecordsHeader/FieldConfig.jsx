import _ from 'lodash'
import $ from 'jquery'
import React from 'react'
import Reflux from 'reflux'
import classNames from 'classnames'
import FIELD_TYPES from '../../../../../../../../../../configs/fieldTypes'
import dndContext from '../../../../../../../../../../services/dndContext'
import userSettingsActions from '../../../../../../../../../../actions/userSettingsActions'
import UserSettingsStore from '../../../../../../../../../../stores/UserSettingsStore'

import FieldConfigItem from './FieldConfigItem'

const CLOSE_TIMEOUT = 2000;

function getOrderArray(fields, fieldOrdersFromSettings = []) {
  // need sorting  by
  //console.log(fields.toJS());
  let fieldIds = fields.map(col => col.get('id')).toArray();
  let notSetOrderOnField = _.difference(fieldIds, fieldOrdersFromSettings);

  return (fieldOrdersFromSettings || [])
    .filter(id => fieldIds.indexOf(id) !== -1)
    .concat(notSetOrderOnField);
}

const FieldConfig = React.createClass({
  mixins: [Reflux.listenTo(UserSettingsStore, "onUserSettings")],
  propTypes: {
    fields: React.PropTypes.object.isRequired,
    catalogId: React.PropTypes.string.isRequired
  },

  getInitialState() {
    let fieldOrdersFromSettings = UserSettingsStore.getFieldsOrder({ catalogId: this.props.catalogId });
    return {
      visible: false,
      fieldsOrder: getOrderArray(this.props.fields, fieldOrdersFromSettings)
    };
  },

  // refactor
  onUserSettings(store, state) {
    // update user settings visible for FieldConfigItem.
    this.setState({ userSettingsState: state });
  },

  onClick() {
    this.setState({
      visible: !this.state.visible
    });
    if (!this.state.visible) {
      this.startCloseTimer();
    }
  },

  cleatCloseTimer() {
    clearTimeout(this.closeTimer);
  },

  startCloseTimer() {
    this.closeTimer = setTimeout(() => {
      this.setState({
        visible: false
      });
    }, CLOSE_TIMEOUT);
  },

  onClickOutside(e) {
    if (!$(e.target).is('.field-config') && $(e.target).parents('.field-config').size() === 0) {
      this.setState({
        visible: false
      });
    }
  },

  onChangeVisibility(colId, visible) {
    userSettingsActions.setFieldVisibility({
      catalogId: this.props.catalogId,
      fieldId: colId,
      visible: visible
    });
  },

  onDragStart(colId) {
  },

  onDragEnd(colId) {
    //let curIndex = this.props.fields.findIndex((c)=> c.get('id') === colId);
    //let newIndex = this.state.fieldsOrder.indexOf(colId);
    //
    //if (curIndex === newIndex || curIndex === -1 || newIndex === -1) {
    //  return;
    //}

    userSettingsActions.setFieldsOrder({
      catalogId: this.props.catalogId,
      fieldsOrder: this.state.fieldsOrder
    });
  },

  moveItem(fieldId, afterFieldId) {
    let fieldIndex = this.state.fieldsOrder.indexOf(fieldId),
      newFieldIndex = this.state.fieldsOrder.indexOf(afterFieldId);

    let newOrder = this.state.fieldsOrder.slice();
    newOrder.splice(fieldIndex, 1);
    newOrder.splice(newFieldIndex, 0, fieldId);

    this.setState({
      fieldsOrder: newOrder
    });
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.fields !== this.props.fields) {
      let fieldOrdersFromSettings = UserSettingsStore.getFieldsOrder({ catalogId: nextProps.catalogId });
      let newOrder = getOrderArray(nextProps.fields, fieldOrdersFromSettings);
      if (newOrder.join() !== this.state.fieldsOrder.join()) {
        this.setState({
          fieldsOrder: newOrder
        });
      }
    }
  },

  componentWillUpdate(nextProps, nextState) {
    if (!nextState.visible) {
      this.cleatCloseTimer();
    }
  },

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.visible && this.state.visible) {
      $('body').on('click', this.onClickOutside);
    } else if (prevState.visible && !this.state.visible) {
      $('body').off('click', this.onClickOutside);
    }
  },

  componentWillUnmount() {
    $('body').off('click', this.onClickOutside);
    this.cleatCloseTimer();
  },

  onMouseDown(e) {
    e.stopPropagation();
  },

  indexOfFieldsOrder(item) {
    return this.state.fieldsOrder.indexOf(item);
  },

  render() {
    // sort field by order params.
    let fields = this.props.fields
      .map(col => {
        let index = this.indexOfFieldsOrder(col.get('id'));
        return col.set('_order', index == -1 ? Number.MAX_SAFE_INTEGER : index);
      })
      .sort((c1, c2) => {
        return c1.get('_order') - c2.get('_order')
      });

    return (
      <div className={classNames({ 'field-config': true, 'field-config--open': this.state.visible })}
        onMouseDown={this.onMouseDown}>
        <span className="field-config__dots" onClick={this.onClick}>
          <nobr>...</nobr>
        </span>

        <div className="field-config__list"
          onMouseEnter={this.cleatCloseTimer}
          onMouseLeave={this.startCloseTimer}>
          {fields
            .filter(col => col.get('type') !== FIELD_TYPES.GROUP)
            .map((col) => {
              let colId = col.get('id');
              // get setting for current FieldConfigItem, from UserSetting store.
              let visible = UserSettingsStore.getVisibilityField({
                fieldId: colId,
                catalogId: this.props.catalogId
              }, true);

              return <FieldConfigItem
                key={colId}
                visible={visible}
                onChangeVisibility={this.onChangeVisibility}
                onDragStart={this.onDragStart}
                onDragEnd={this.onDragEnd}
                moveItem={this.moveItem}
                field={col} />;
            })}
        </div>
      </div>
    );
  }

});

export default dndContext(FieldConfig);
