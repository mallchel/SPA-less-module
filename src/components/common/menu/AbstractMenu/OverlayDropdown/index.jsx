import React, { Component } from 'react'
import { Dropdown } from 'antd';
import ButtonTransparent from '../../../elements/ButtonTransparent'
import cn from 'classnames'
import _ from 'lodash'
import Item from './Item'

import styles from './OverlayDropdown.less'

class OverlayDropdown extends Component {
  state = {
    visible: false,
    textSearch: ''
  };

  search = (e) => {
    this.setState({
      textSearch: e.target.value
    })
  }
  componentDidMount() {
  }
  handleVisibleChange = (flag) => {
    this.setState({ visible: flag });
  }
  hidden = () => {
    console.log(this.visible)
    this.setState({ visible: false });
  }
  render() {
    const { textSearch } = this.state;
    const filterData = textSearch
      ? this.props.items.filter(item => {
        return item.get('name').toLowerCase().indexOf(textSearch) !== -1
      })
      : this.props.items;

    const { props: { vertical } } = this;
    const menu = (
      <ul
        className={cn(this.props.vertical.menu, styles.menu, 'ant-dropdown-menu ant-dropdown-menu-vertical ')}
        ref={this.props.container}
      >
        <li
          className={styles.itemSearch}
        >
          <input
            type="search"
            className={styles.input}
            placeholder='поиск'
            onChange={this.search}
            onClick={e => e.stopPropagation()}
          />
        </li>
        {
          filterData.map(item => {
            return <Item
              key={item.get('id')}
              item={item}
              vertical={vertical}
              route={this.props.route}
              canDrag={this.props.canDrag}
              onMoveItem={this.props.onMoveItem}
              onDragEnd={this.props.onDragEnd}
              dragType={this.props.dragType}
              params={this.props.params}
            />
          })
        }
      </ul>
    );

    return (
      <Dropdown
        overlay={menu}
        placement="bottomRight"
        trigger={['click']}
        onVisibleChange={this.props.onVisibleChange}
      >
        <ButtonTransparent>...</ButtonTransparent>
      </Dropdown>
    );
  }
}

export default OverlayDropdown;
