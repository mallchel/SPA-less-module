import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Immutable from 'immutable'
import PropTypes from 'prop-types'
import _ from 'lodash'
import $ from 'jquery'
import catalogActions from '../../../../actions/catalogActions'
import dndContext from '../../../../services/dndContext'
import apiActions from '../../../../actions/apiActions'
import changeMapOrder from '../../../../utils/changeMapOrder'
import routes from '../../../../routes'

import ListMenu from '../../../common/menu/ListMenu'
import styles from './headerCatalog.less'

const log = require('debug')('CRM:Component:Sidebar:List');

function getOrder(catalogs) {
  return catalogs.map(t => new Immutable.Map({ id: t.get('id'), index: t.get('index') }));
}
const Menu = React.createClass({
  priorities: null,
  mixins: [PureRenderMixin],
  propTypes: {
    sectionId: PropTypes.string.isRequired,
    catalogs: PropTypes.object.isRequired,
    currentIdCatalog: PropTypes.string
  },

  getInitialState() {
    return {
      order: getOrder(this.props.catalogs),
      moveOrder: null,
      currentIdCatalog: this.props.currentIdCatalog
    };
  },

  componentDidMount() {
    this.debouncedSavePriority = _.debounce(
      () => this.savePriority(),
      5000
    );
    $(window).on('beforeunload', (event) => {
      this.savePriority();
    })
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      currentIdCatalog: nextProps.currentIdCatalog
    });
    if (this.props.sectionId !== nextProps.sectionId) {
      this.savePriority();
      this.setState({
        order: getOrder(nextProps.catalogs)
      });
    }
  },

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
  },

  onDragEnd(catalogId) {
    log('onDragEnd');
    // this.state.order.getIn([catalogId, 'index'])
    let priorities = this.state.order.map((order, catalogId) => {
      return { catalogId, order: order.get('index') };
    }).toJS();
    priorities = _.sortBy(_.values(priorities), 'order').map((priority) => priority.catalogId);

    //Оптимистичное обновление на клиенте
    let order = this.state.order.map(t => {
      let newIndex = priorities.indexOf(t.get('id'));
      catalogActions.changeSortIndex(t.get('id'), newIndex);
      return new Immutable.Map({ id: t.get('id'), index: newIndex })
    });

    //Обновление на сервере
    this.priorities = priorities;
    this.debouncedSavePriority();

    this.setState({ order });
  },

  onMoveItem(catalogId, aftercatalogId) {
    log('onMoveITem', catalogId, aftercatalogId);
    this.setState({
      order: getOrder(changeMapOrder(this.state.order, catalogId, this.state.order.getIn([aftercatalogId, 'index'])))
    });
  },

  render() {
    let items = this.state.order.toList()
      .sortBy(c => c.get('index'))
      .map(c => this.props.catalogs.get(c.get('id')))
      .filter(c => c)
    return (
      <ListMenu
        route={routes.catalog}
        params='catalogId'
        items={this.props.catalogs}
        className={styles.shiftLeft}
      />
    );
  },

  componentDidUpdate(prevProps, prevState) {
    if (this.props.catalogs !== prevProps.catalogs) {
      let newOrder = getOrder(this.props.catalogs);
      if (newOrder.toArray().join() !== prevState.order.toArray().join()) {
        log('set order');
        this.setState({
          order: newOrder
        });
      }
    }
  }

});

export default Menu;
