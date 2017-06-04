import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import ItemListEditorItem from './ItemListEditorItem'
import editorActions from '../../../actions/editorActions'
import Guid from 'guid'
import Immutable from 'immutable'
import _ from 'lodash'
import DROPDOWN_COLORS from '../../../configs/dropdownColors'
import KEYS from '../../../configs/keys'
import trs from '../../../getTranslations'
// import changeMapOrder from '../../../utils/changeMapOrder';

const ItemListEditor = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    field: React.PropTypes.object.isRequired,
    fieldIndex: React.PropTypes.number.isRequired,
    withColor: React.PropTypes.bool,
    sectionId: React.PropTypes.string.isRequired,
    disabled: React.PropTypes.bool
  },

  getInitialState() {
    return {
      value: '',
      items: this.props.field.getIn(['config', 'items'])
    };
  },

  onKeyDown(e) {
    if (e.keyCode === KEYS.ENTER && this.state.value) {
      e.preventDefault();
      if (this.onAddItem(this.state.value)) {
        this.setState({
          value: ''
        });
      }
    }
  },

  onChange(e) {
    this.setState({
      value: e.target.value
    });
  },

  moveItem(itemName, afterItemName) {
    let items = this.state.items;
    let itemIndex = items.findIndex(i => i.get('name') === itemName);
    let afterItemIndex = items.findIndex(i => i.get('name') === afterItemName);

    let item = items.get(itemIndex);
    items = items.splice(itemIndex, 1);
    items = items.splice(afterItemIndex > itemIndex ? afterItemIndex : afterItemIndex, 0, item);

    this.setState({
      items: items,
      itemsMoved: true
    });
  },

  onChangeItemOrder() {
    editorActions.changeFieldConfig(this.props.sectionId, this.props.fieldIndex, {
      items: this.state.items
    });
  },

  onAddItem(text) {
    if (!this.props.field.getIn(['config', 'items']).find((item) => item.get('name') === text)) {
      editorActions.changeFieldConfig(this.props.sectionId, this.props.fieldIndex, {
        items: this.props.field.getIn(['config', 'items']).concat(Immutable.fromJS([{
          name: text,
          color: this.props.withColor ? DROPDOWN_COLORS[9] : undefined,
          _cid: Guid.raw()
        }]))
      });
      return true;
    }
    return false;
  },

  onRemoveItem(itemIndex) {
    let items = this.props.field.getIn(['config', 'items']);
    items = items.delete(itemIndex);
    editorActions.changeFieldConfig(this.props.sectionId, this.props.fieldIndex, {
      items: items
    });
  },

  onChangeItemColor(itemIndex, color) {
    let items = this.props.field.getIn(['config', 'items']);
    items = items.setIn([itemIndex, 'color'], color);
    editorActions.changeFieldConfig(this.props.sectionId, this.props.fieldIndex, {
      items: items
    });
  },

  onChangeItemName(itemIndex, name) {
    let items = this.props.field.getIn(['config', 'items']);
    items = items.setIn([itemIndex, 'name'], name);
    editorActions.changeFieldConfig(this.props.sectionId, this.props.fieldIndex, {
      items: items
    });
  },

  componentWillReceiveProps(nextProps) {
    let oldItems = this.props.field.getIn(['config', 'items']);
    let newItems = nextProps.field.getIn(['config', 'items']);
    if (!Immutable.is(oldItems, newItems)) {
      this.setState({
        items: newItems
      });
    }
  },

  render() {
    let items = [];

    if (this.state.items && this.state.items.size) {
      items = this.state.items.map((item, i) => {
        return (
          <ItemListEditorItem
            fieldIndex={this.props.fieldIndex}
            key={item.get('id') || item.get('_cid')} // bad work react-dnd with key=i
            disabled={this.props.disabled}
            itemId={item.get('id')}
            itemIndex={i}
            name={item.get('name')}
            color={item.get('color')}
            withColor={this.props.withColor}
            moveItem={this.moveItem}
            onChangeName={this.onChangeItemName}
            onChangeColor={this.onChangeItemColor}
            onRemove={this.onRemoveItem}
            onDragEnd={this.onChangeItemOrder} />
        );
      });
    }

    return (
      <div className="items-list">
        <input type="text" disabled={this.props.disabled} value={this.state.value}
          placeholder={trs('fieldTypes.dropdown.namePlaceholderItem')}
          onChange={this.onChange} onKeyDown={this.onKeyDown} />

        <i className="icon icon--keyboard-20"></i>

        <div className="items-list__list" style={{ display: items.size === 0 ? 'none' : '' }}>
          {items}
        </div>

      </div>
    );
  }

});

export default ItemListEditor;
