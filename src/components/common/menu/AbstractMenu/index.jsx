import React, { Component } from 'react'
import OverlayDropdown from './OverlayDropdown'
import { Row } from 'antd'
import cn from 'classnames'
import _ from 'lodash'
import PropTypes from 'prop-types'

import MenuItem from './MenuItem'
import dndContext from '../../../../services/dndContext'

class AbstractMenu extends Component {
  static propTypes = {
    items: PropTypes.object,
    onDragEnd: PropTypes.func
  }

  state = {
    order: this.props.items
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.canDrag) {
      return
    }

    this.setState({
      order: nextProps.items
    });
  }

  savePriority = () => {
    if (!this.priorities) {
      return;
    }
    this.props.saveToServer(this.priorities);
    this.priorities = null;
  }

  onDragEnd = (itemId) => {
    this.props.onDragEnd(this.state.order.map(o => o.get('id')));
  }

  onMoveItem = (itemId, afterItemId) => {
    const findIndex = id => this.state.order.findIndex(o => o.get('id') === id);

    let arr = this.state.order
      .delete(findIndex(itemId))
      .insert(findIndex(afterItemId), this.state.order.get(findIndex(itemId)));

    this.setState({
      order: arr
    });
  }

  render() {
    const {
      className,
      horizontal,
      vertical,
      route,
      params } = this.props;
    const items = this.state.order;

    return (
      <Row type="flex" justify="space-between" align="middle" className={cn(className)}>
        <ul className={cn(horizontal.menu)}>
          {
            items.map((item, i) => (
              <MenuItem
                key={item.get('id')}
                item={item}
                {...this.props}
                onDragEnd={this.onDragEnd}
                onMoveItem={this.onMoveItem}
              />
            ))
          }
        </ul>
        <div>
          <OverlayDropdown
            items={items}
            route={route}
            params={params}
            vertical={vertical}
          />
        </div>
      </Row>
    )
  }
}

export default dndContext(AbstractMenu);
