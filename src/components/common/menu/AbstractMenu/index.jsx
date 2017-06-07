import React, { Component } from 'react'
import OverlayDropdown from './OverlayDropdown'
import { Row } from 'antd'
import cn from 'classnames'
import _ from 'lodash'
import PropTypes from 'prop-types'
import Immutable from 'immutable'

import MenuItem from './MenuItem'
import dndContext from '../../../../services/dndContext'

const EmptyList = Immutable.List()

class AbstractMenu extends Component {
  static propTypes = {
    items: PropTypes.object,
    onDragEnd: PropTypes.func
  }

  state = {
    order: this.props.items,
    index: -1
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      order: nextProps.items
    });
  }

  onDragEnd = () => {
    this.props.onDragEnd(this.state.order.map(o => o.get('id')));
  }

  onMoveItem = (itemId, afterItemId) => {
    const findIndex = id => this.state.order.findIndex(o => o.get('id') === id);

    let arr = this.state.order.toList()
      .delete(findIndex(itemId))
      .insert(findIndex(afterItemId), this.state.order.get(findIndex(itemId)));

    this.setState({
      order: arr,
    });
  }

  countVisibleChildrens = () => {
    const childrens = _.toArray(this.ul.children);
    const firstChild = childrens[0];
    if (firstChild) {
      const topFirst = childrens[0].getBoundingClientRect().top;
      const index = childrens.findIndex(el => el.getBoundingClientRect().top > topFirst);
      this.setState({
        index: index
      })
    }
    this.setState({
      index: -1
    })
  }

  render() {
    const {
      className,
      horizontal,
      vertical,
      route,
      dragType,
      params,
      canDrag } = this.props;
    const { order, index } = this.state;
    const items = order;

    return (
      <Row type="flex" justify="space-between" align="middle" className={cn(className)}>
        <ul className={cn(horizontal.menu)} ref={node => this.ul = node}>
          {
            items.map((item, i) => (
              <MenuItem
                key={item.get('id')}
                item={item}
                dragType={dragType}
                onDragEnd={this.onDragEnd}
                onMoveItem={this.onMoveItem}
                horizontal={horizontal}
                route={route}
                params={params}
                canDrag={canDrag}
              />
            ))
          }
        </ul>
        <div>
          <OverlayDropdown
            items={index > -1 ? items.slice(index) : EmptyList}
            route={route}
            params={params}
            dragType={dragType}
            vertical={vertical}
            onDragEnd={this.onDragEnd}
            onMoveItem={this.onMoveItem}
            canDrag={canDrag}
            onVisibleChange={this.countVisibleChildrens}
          />
        </div>
      </Row>
    )
  }
}

export default dndContext(AbstractMenu);
