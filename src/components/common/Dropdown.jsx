import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import ReactDOM from 'react-dom'
import cn from 'classnames'
import $ from "jquery"
import PropTypes from 'prop-types'
import { Input, Select } from 'antd'

import trs from '../../getTranslations'
import _ from 'lodash'
import KEYS from '../../configs/keys'
import LoadingSpinner from '../common/LoadingSpinner'

import styles from './dropdown.less'

const Option = Select.Option;

const log = require('debug')('CRM:Component:Dropdown');

const DropdownItem = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    onClick: PropTypes.func.isRequired,
    select: PropTypes.func.isRequired,
    itemKey: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired,
    text: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element
    ]).isRequired
  },
  onClick() {
    this.props.onClick(this.props.itemKey);
  },

  onMouseEnter() {
    this.props.select(this.props.itemKey);
  },

  render() {
    return (
      <div onClick={this.onClick}
        onMouseEnter={this.onMouseEnter}
        className={cn(styles.item, { [styles.itemCurrent]: this.props.selected })}
      >
        {this.props.text}
      </div>
    );
  }
});

const DropdownItemClick = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    itemKey: PropTypes.string.isRequired,
    item: PropTypes.object,
    select: PropTypes.func.isRequired,
    selected: PropTypes.bool.isRequired
  },

  onMouseEnter() {
    this.props.select(this.props.itemKey);
  },

  onClick(e) {
    this.props.onClick();
  },
  onClickA(e) {
    e.preventDefault();
  },

  render() {
    return (
      this.props.item.removed ?
        <div className={'dropdown__list-item dropdown__list-add-catalog' +
          (this.props.item.removed ? ' dropdown__list-item-click--disabled' : '')}>
          <a title={trs('fieldTypes.dropdown.removedCatalog')} className="dropdown__list-add-catalog-link">{trs('fieldTypes.dropdown.AddInCatalog')} «{this.props.item.title}» </a>
        </div>
        :
        <div onMouseEnter={this.onMouseEnter}
          onClick={this.onClick}
          className={'dropdown__list-item dropdown__list-add-catalog' + (this.props.selected ? ' ' + styles.itemCurrent : '')}
        >
          <a onClick={this.onClickA} className="dropdown__list-add-catalog-link">
            {trs('fieldTypes.dropdown.AddInCatalog')} «{this.props.item.title}»</a>
        </div>
    );
  }
});

// const DropdownSelectedItem = React.createClass({
//   mixins: [PureRenderMixin],
//   propTypes: {
//     item: PropTypes.object.isRequired,
//     disabled: PropTypes.bool,
//     onRemove: PropTypes.func.isRequired
//   },
//   onClickRemove(e) {
//     e.stopPropagation();
//     this.props.onRemove(this.props.item);
//   },

//   render() {
//     return (
//       <div className="dropdown__selected-item">
//         <span>{this.props.item.text}</span>
//         {!this.props.disabled ? <i className="m-close" onClick={this.onClickRemove}>&times;</i> : null}
//       </div>
//     );
//   }
// });


const Dropdown = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    additionalClickItems: PropTypes.array,
    items: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired
    })).isRequired,
    multiselect: PropTypes.bool,
    autocomplete: PropTypes.bool,
    clearOnSelect: PropTypes.bool,
    closeOnSelect: PropTypes.bool,
    withButton: PropTypes.bool,
    value: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array,
      PropTypes.string
    ]),
    onSelectItems: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    onOpenChange: PropTypes.func,
    onTextChange: PropTypes.func,
    showLoading: PropTypes.bool,
    autoFocus: PropTypes.bool,
    onBlur: PropTypes.func
  },

  getInitialState() {
    return {
      hasFocus: false,
      isOpen: false,
      inputText: '',
      selectedItems: [],
      filteredItems: [],
      currentItem: null,
      currentItemSetByKeys: false,
      listAboveInput: false
    };
  },

  selectItem(items, replace, allItems = this.props.items) {
    if (!items && this.state.selectedItems.length === 0) {
      return;
    }

    if (typeof items === 'string' && !this.props.multiselect &&
      this.state.selectedItems.length > 0 &&
      items === this.state.selectedItems[0].key) {
      return;
    }

    if (!_.isArray(items)) {
      items = [items];
    }

    let itemsByKey = {};

    allItems.forEach((item) => itemsByKey[item.key] = item);

    items = items
      .map((item) => {
        if (typeof item === 'string') {
          return itemsByKey[item];
        } else {
          return item && itemsByKey[item.key] || false;
        }
      })
      .filter((item) => item);

    if (!items.length) {
      log('try to select no items');
      this.setState({
        selectedItems: [],
        inputText: this.props.multiselect ? this.state.inputText : ''
      });
      return;
    }

    if (_.difference(items, this.state.selectedItems).length === 0) {
      return;
    }

    if (this.props.multiselect) {
      let newItems;
      if (replace) {
        newItems = items.slice();
      } else {
        newItems = _.uniq(this.state.selectedItems.concat(items), 'key');
      }
      this.setState({
        selectedItems: newItems
      });
      return newItems;
    } else {
      let newItems = [items[0]];
      this.setState({
        selectedItems: newItems,
        inputText: this.props.clearOnSelect ? '' : items[0].text
      });
      return newItems;
    }
  },

  removeSelectedItem(item) {
    let newItems = this.state.selectedItems.slice();
    newItems.splice(this.state.selectedItems.indexOf(item), 1);
    this.setState({
      selectedItems: newItems
    });
  },

  toggleList(isOpen) {
    if (isOpen == null) {
      isOpen = !this.state.isOpen;
    }
    if (isOpen !== this.state.isOpen) {
      if (!isOpen) {
        ReactDOM.findDOMNode(this.refs.input).blur();
        ReactDOM.findDOMNode(this.refs.list).scrollTop = 0;
      }
      this.setState({
        isOpen: isOpen,
        currentItem: null,
        currentItemSetByKeys: false
      });
      if (typeof this.props.onOpenChange === 'function') {
        this.props.onOpenChange(isOpen);
      }
    }
  },

  setCurrentItemByMouse(itemKey) {
    if (_.find(this.props.items, (item) => item.key === itemKey)) {
      this.setState({
        currentItem: _.find(this.props.items, (item) => item.key === itemKey),
        currentItemSetByKeys: false
      });
    } else {
      this.setState({
        currentItem: { key: itemKey },
        currentItemSetByKeys: false
      });
    }
  },

  setListPosition() {
    let list = ReactDOM.findDOMNode(this.refs.list),
      listH = list.offsetHeight,
      input = ReactDOM.findDOMNode(this.refs.input),
      $input = $(input),
      inputTop = $input.offset().top,
      inputH = $input.height(),
      winH = $(window).height();

    this.setState({
      listAboveInput: winH - inputTop - inputH < listH && inputTop > listH
    });

  },

  setCurrentItemScrollPosition() {
    let list = ReactDOM.findDOMNode(this.refs.list),
      $list = $(list),
      listH = list.offsetHeight,
      listScrollTop = list.scrollTop,
      currentItem = $list.find('.' + styles.itemCurrent)[0],
      top = currentItem.offsetTop,
      height = currentItem.offsetHeight;

    if (top + height - listScrollTop > listH) {
      list.scrollTop = top + height - listH + 15;
    } else if (top < listScrollTop) {
      list.scrollTop = top - 15;
    }
  },

  onFocusInput(e) {
    this.toggleList(true);
    if (!this.props.multiselect && this.props.autocomplete) {
      let el = e.target;
      setTimeout(() => {
        el.setSelectionRange(0, el.value.length);
      });
    }
    this.setState({
      hasFocus: true
    });
  },

  onBlurInput() {
    this.setState({
      // isOpen: this.props.autocomplete ? false : this.state.isOpen,
      hasFocus: false
    });
    if (this.props.onBlurInput) {
      this.props.onBlurInput(this.state.inputText);
    }
  },

  onClickWrapper() {
    ReactDOM.findDOMNode(this.refs.input).focus();
  },

  onClickItem(item) {
    this.selectItem(item);
    if (this.props.multiselect || this.props.clearOnSelect) {
      this.setState({
        inputText: '',
        currentItem: this.props.clearOnSelect ? this.state.filteredItems[0] : this.state.currentItem
      });
      if (this.props.closeOnSelect) {
        this.toggleList(false);
      } else {
        ReactDOM.findDOMNode(this.refs.input).focus();
      }
    } else {
      this.toggleList(false);
    }
  },

  onKeyDown(e) {
    if (e.keyCode === KEYS.ESC) {
      this.toggleList(false);

    } else if (e.keyCode === KEYS.DOWN || e.keyCode === KEYS.UP) {
      let nextIndex;
      let currentIndex = !this.state.currentItem ? -1 : _.findIndex(this.state.filteredItems, (item) => item === this.state.currentItem);

      if (e.keyCode === KEYS.DOWN) {
        nextIndex = (currentIndex === -1 || currentIndex === this.state.filteredItems.length - 1) ? 0 : currentIndex + 1;
      } else {
        nextIndex = (currentIndex === -1 || currentIndex === 0) ? this.state.filteredItems.length - 1 : currentIndex - 1;
      }

      this.setState({
        currentItem: this.state.filteredItems[nextIndex],
        currentItemSetByKeys: true
      });

      e.preventDefault();

    } else if (e.keyCode === KEYS.ENTER) {
      if (this.state.currentItem) {
        this.onClickItem(this.state.currentItem);
      }
      e.preventDefault();
    }
  },

  onChange(e) {
    let val = e.target.value;
    this.setState({
      inputText: val
    });
    if (typeof this.props.onTextChange === 'function') {
      this.props.onTextChange(val);
    }
  },

  onClickButton(e) {
    e.stopPropagation();
    this.toggleList();
  },

  onClickNoitems(e) {
    e.stopPropagation();
    this.toggleList();
  },

  onOutsideClick(e) {
    const node = ReactDOM.findDOMNode(this.refs.node);
    if (e.target === node) {
      return this.toggleList(false);
    }

    const parents = $(e.target).parents('.' + styles.dropdown);
    if (parents.size() === 0 || !_.find(parents.toArray(), (el) => el === node)) {
      return this.toggleList(false);
    }
  },

  setFilteredItems(items = this.props.items, selectedItems = this.state.selectedItems) {
    let selectedKeys = {};
    let visibleAll = false;
    selectedItems.forEach((item) => { selectedKeys[item.key] = true; if (item.alwaysVisible) { visibleAll = true; } });
    let filterText = this.state.inputText.toLowerCase();
    items = items.filter((item) => (!this.props.multiselect || (this.props.multiselect && !selectedKeys[item.key])) &&
      (visibleAll || item.alwaysVisible || !this.props.autocomplete || !filterText ||
        (this.props.autocomplete && !this.props.multiselect && !this.state.isOpen) ||
        (item.text || '').toLowerCase().indexOf(filterText) !== -1));
    log('setFilteredItems');
    this.setState({
      filteredItems: items
    });
  },

  setInputWidth() {
    if (this.props.multiselect && this.props.autocomplete) {
      log('set width');
    }
  },

  componentDidUpdate(prevProps, prevState) {
    log('ComponentDidUpdate');

    if (prevState.inputText !== this.state.inputText) {
      this.setInputWidth();
    }

    if (this.props.autocomplete !== prevProps.autocomplete || !_.isEqual(this.state.selectedItems, prevState.selectedItems) ||
      this.state.inputText !== prevState.inputText) {
      this.setFilteredItems();
    }

    if (!prevState.isOpen && this.state.isOpen) {
      $('body').on('mousedown', this.onOutsideClick);
      this.setListPosition();
    } else if (prevState.isOpen && !this.state.isOpen) {
      $('body').off('mousedown', this.onOutsideClick);
    }

    if (this.state.isOpen && this.state.currentItemSetByKeys && prevState.currentItem !== this.state.currentItem) {
      this.setCurrentItemScrollPosition();
    }

    if (!_.isEqual(this.state.selectedItems, prevState.selectedItems)) {
      this.props.onSelectItems(this.state.selectedItems);
      if (this.props.clearOnSelect) {
        // setTimeout(()=> this.selectItem(false);
      }
    }
    if (!this.props.multiselect && !this.props.autocomplete) {
      let inputText = this.state.selectedItems[0] && this.state.selectedItems[0].text || '';
      if (this.state.inputText !== inputText && inputText) {
        this.setState({
          inputText: inputText
        });
      }
    }

    if (typeof this.props.onBlur === 'function' &&
      ((!this.state.hasFocus && prevState.hasFocus && !this.state.isOpen) ||
        (!this.state.isOpen && prevState.isOpen && !this.state.hasFocus))) {
      this.props.onBlur();
    }
  },

  componentWillReceiveProps(nextProps) {
    log('componentWillReceiveProps', nextProps);
    let differentValues = !_.isEqual(this.props.value, nextProps.value);
    if (nextProps.autoFocus && !this.state.hasFocus && (this.refs.input)) {
      let el = ReactDOM.findDOMNode(this.refs.input);
      setTimeout(() => {
        el.focus();
        el.setSelectionRange(0, el.value.length);
      }, 100);
    }
    if (differentValues || this.props.items.length !== nextProps.items.length) {
      let inputText = this.state.inputText;
      this.selectItem(differentValues ? nextProps.value : this.state.selectedItems, true, nextProps.items);
      // hack.
      if (inputText) {
        this.setState({ inputText });
      }
      if (this.props.items.length !== nextProps.items.length) {
        this.setFilteredItems(nextProps.items);
      }
    }
  },

  componentWillMount() {
    log('componentWillMount');
    let selectedItems;
    if (this.props.value) {
      selectedItems = this.selectItem(this.props.value, true);
    }
    if (!this.props.multiselect && this.props.autocomplete) {
      selectedItems = [];
    }
    this.setFilteredItems(this.props.items, selectedItems);
  },

  componentDidMount() {
    this.setInputWidth();
    if (this.props.autoFocus) {
      let el = ReactDOM.findDOMNode(this.refs.input);
      el.focus();
      el.setSelectionRange(0, el.value.length);
    }
  },

  componentWillUnmount() {
    $('body').off('mousedown', this.onOutsideClick);
  },

  MyChange(e) {
    console.log('MyChange', e)
  },

  onSelect(e) {
    console.log('onSelect', e)
  },

  onSearch(e) {
    console.log('onSearch', e)
  },

  render() {
    let items = (this.props.additionalClickItems || []).map((item, i) =>
      <DropdownItemClick
        key={item.id}
        item={item}
        itemKey={'add:' + item.id}
        selected={this.state.currentItem && this.state.currentItem.key == ('add:' + item.id) || false}
        select={this.setCurrentItemByMouse}
        onClick={() => {
          this.toggleList(false);
          this.props.onClickAddLinkedItem(item);
        }}
        text={item.component || item.text} />
    );
    items = items.concat(this.state.filteredItems.map((item, i) =>
      <DropdownItem
        key={item.key}
        selected={this.state.currentItem && this.state.currentItem.key === item.key || false}
        itemKey={item.key}
        onClick={this.onClickItem}
        select={this.setCurrentItemByMouse}
        text={item.component || item.text} />)
    );

    let inputProps = this.props.autocomplete ? { onChange: this.onChange } : { readOnly: 'true' };
    let inputValue = this.props.multiselect && !this.props.autocomplete ? undefined : this.state.inputText;

    let classes = cn({
      // 'dropdown': true,
      // [styles.open]: this.state.isOpen,
      // 'dropdown--empty': !inputValue,
      // 'dropdown--with-button': this.props.withButton,
      // 'dropdown--has-items': this.props.multiselect && this.state.selectedItems.length
    });


    // let selectedItems;
    // if (this.props.multiselect) {
    //   selectedItems = this.state.selectedItems.map((item) =>
    //     <DropdownSelectedItem item={item} disabled={this.props.disabled} key={item.key}
    //       onRemove={this.removeSelectedItem} />);
    // }

    // check css
    // let css = {};
    // if (!this.state.inputText && this.state.selectedItems.length > 0) {
    //   css['width'] = Math.max(5) + 'px';
    // }

    return (
      <div ref="node" className={cn(classes, styles.dropdown)}>
        {
          this.props.type === 'catalogs' ?
            <Select
              mode="multiple"
              className={styles.select}
              placeholder={this.props.placeholder}
              defaultValue={this.state.selectedItems.map(item => item.text)}
              onFocus={() => this.props.onOpenChange(true)}
              onBlur={() => this.props.onOpenChange(false)}
              onChange={this.MyChange}
              onSelect={this.onSelect}
              onSearch={this.onSearch}
            >
              {
                this.state.filteredItems.map((item, i) => <Option key={item.key}>{item.text}</Option>)
              }
            </Select>

            :

            <div onClick={this.onClickWrapper}>
              <Input
                size='default'
                disabled={this.props.disabled}
                ref="input"
                onFocus={this.onFocusInput}
                onBlur={this.onBlurInput}
                {...inputProps}
                placeholder={this.props.placeholder}
                value={inputValue}
                onKeyDown={this.onKeyDown}
              />
              <span ref="hidden"
                className={styles.hiddenText}>{this.state.inputText ? '_' + this.state.inputText + '_' : ''}</span>


              {this.props.withButton && !this.props.showLoading ?
                <span className="dropdown__button" onClick={this.onClickButton}>
                  <i></i>
                </span> :
                null
              }
              {this.props.withButton && this.props.showLoading ?
                <span className="dropdown__button" onClick={this.onClickButton}>
                  <LoadingSpinner />
                </span> :
                null
              }

              {
                this.state.isOpen &&
                <div ref="list" className={cn(styles.list, (this.state.listAboveInput ? ' dropdown__list--above' : ''))}>
                  {items}
                  {(this.props.showLoading || items.length === 0) && !this.props.withButton ?
                    <span onClick={this.onClickNoitems}>
                      {this.props.showLoading ? trs('dropdown.loading') : trs('dropdown.noitems')}
                    </span> : null}
                </div>
              }

            </div>
        }

      </div>
    );
  }

});

export default Dropdown;
