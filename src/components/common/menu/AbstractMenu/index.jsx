import React, { Component } from 'react'
import OverlayDropdown from './OverlayDropdown'
import { Row } from 'antd'
import cn from 'classnames'
import Immutable from 'immutable'
import _ from 'lodash'
import PropTypes from 'prop-types'

import MenuItem from './MenuItem'
import catalogActions from '../../../../actions/catalogActions'
import dndContext from '../../../../services/dndContext'
import changeMapOrder from '../../../../utils/changeMapOrder'
import apiActions from '../../../../actions/apiActions'
import { connect } from '../../../StateProvider'
// import { DragSource, DropTarget } from 'react-dnd'
// import NavLink from '../../router/Link'
// import dndTargets from '../../configs/dndTargets'
// import dragAndDropActions from '../../actions/dragAndDropActions'

// import styles from './abstractMenu.less'


function getOrder(catalogs) {
  console.log(catalogs)
  return catalogs.map(t => new Immutable.Map({ id: t.get('id'), index: t.get('index') }));
}

class AbstractMenu extends Component {
  static propTypes = {
    items: PropTypes.object
  }

  componentDidMount() {
    console.log(this.props)
    if (!this.props.canDrag) {
      return
    }
    catalogActions.saveMapOrder(getOrder(this.props.items));
    this.debouncedSavePriority = _.debounce(
      () => this.savePriority(),
      5000
    );
    window.addEventListener('beforeunload', (event) => {
      this.savePriority();
    })
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.canDrag) {
      return
    }
    console.log(31131)
    if (this.props.sectionId !== nextProps.sectionId || !this.props.catalogMapOrder.size) {
      this.savePriority();
      catalogActions.saveMapOrder(getOrder(nextProps.items));
    }
  }

  componentWillUnmount() {
    this.savePriority();
  }

  savePriority() {
    if (!this.priorities) {
      return;
    }
    apiActions.updateSection({
      sectionId: this.props.sectionId
    }, {
        catalogsPriorities: this.priorities
      });
    this.priorities = null;
  }

  onDragEnd(catalogId) {
    console.log('onDragEnd', catalogId)
    this.state.order.getIn([catalogId, 'index'])
    let priorities = this.state.order.map((order, catalogId) => {
      return { catalogId, order: order.get('index') };
    }).toJS();
    priorities = _.sortBy(_.values(priorities), 'order').map((priority) => priority.catalogId);

    // Оптимистичное обновление на клиенте
    let order = this.state.order.map(t => {
      let newIndex = priorities.indexOf(t.get('id'));
      catalogActions.changeSortIndex(t.get('id'), newIndex);
      return new Immutable.Map({ id: t.get('id'), index: newIndex })
    });

    // Обновление на сервере
    this.priorities = priorities;
    this.debouncedSavePriority();

    this.setState({ order });
  }

  onMoveItem = (catalogId, aftercatalogId) => {
    const order = getOrder(changeMapOrder(this.props.catalogMapOrder, catalogId, this.props.catalogMapOrder.getIn([aftercatalogId, 'index'])));
    catalogActions.saveMapOrder(order);
  }

  render() {
    const {
      className,
      horizontal,
      vertical,
      items,
      route,
      params } = this.props;

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
              /*<NavLink key={item.get('id')} route={item.get('route') || route} params={(params && { [params]: item.get('id') }) || {}} render={props => {
                return (
                  <li className={cn(horizontal.item, { [horizontal.selected]: props.isActive })}>
                    <Link to={props.link} className={cn(styles.link, horizontal.link)}>
                      {
                        item.get('icon') ? <Icon type={`icon ${item.get('icon')}`} className={cn(horizontal.icon)} /> : null
                      }
                      <div className={horizontal.text}>{item.get('name')}</div>
                    </Link>
                  </li>
                )
              }} />*/
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

export default dndContext(connect(AbstractMenu, ['catalogMapOrder']));
