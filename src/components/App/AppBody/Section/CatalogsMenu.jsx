import React from 'react'
// import PureRenderMixin from 'react-addons-pure-render-mixin'
// import Immutable from 'immutable'
import PropTypes from 'prop-types'
import _ from 'lodash'
import $ from 'jquery'
import catalogActions from '../../../../actions/catalogActions'
// import dndContext from '../../../../services/dndContext'
import apiActions from '../../../../actions/apiActions'
// import changeMapOrder from '../../../utils/changeMapOrder'
import DefaultRedirect from '../../../common/router/DefaultRedirect'
import routes from '../../../../routes'

import ListMenu from '../../../common/menu/ListMenu'
import styles from './section.less'

const log = require('debug')('CRM:Component:Sidebar:List');

const CatalogsMenu = React.createClass({
  priorities: null,
  // mixins: [PureRenderMixin],
  propTypes: {
    sectionId: PropTypes.string,
    catalogs: PropTypes.object.isRequired,
  },

  componentDidMount() {
    const sectionId = this.props.sectionId;

    if (sectionId) {
      apiActions.getCatalogs({ sectionId });
    }
    this.debouncedSavePriority = _.debounce(
      () => this.savePriority(),
      5000
    );
    $(window).on('beforeunload', (event) => {
      this.savePriority();
    })
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.sectionId !== nextProps.sectionId) {
      this.savePriority();
      apiActions.getCatalogs({ sectionId: nextProps.sectionId });
    }
    if (this.props.catalogs && this.props.catalogs !== nextProps.catalogs) {
      if (this.props.catalogs.toArray().join() !== nextProps.catalogs.toArray().join()) {
        log('set order');
        catalogActions.saveMapOrder(nextProps.catalogs);
      }
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
    let priorities = this.props.catalogs.map((order, catalogId) => {
      return { catalogId, order: order.get('index') };
    }).toJS();
    priorities = _.sortBy(_.values(priorities), 'order').map((priority) => priority.catalogId);

    //Оптимистичное обновление на клиенте
    let order = this.props.catalogs.map(t => {
      let newIndex = priorities.indexOf(t.get('id'));
      catalogActions.changeSortIndex(t.get('id'), newIndex);
      return t;
      // return new Immutable.Map({ id: t.get('id'), index: newIndex })
    });

    //Обновление на сервере
    this.priorities = priorities;
    this.debouncedSavePriority();

    catalogActions.saveMapOrder({ order })
  },

  onMoveItem(catalogId, aftercatalogId) {
    log('onMoveITem', catalogId, aftercatalogId);
    catalogActions.changeMapOrder(this.props.catalogs.toList(), catalogId, this.props.catalogs.getIn([aftercatalogId, 'index']));
  },

  render() {
    const sectionId = this.props.sectionId;
    const catalogs = this.props.catalogs.valueSeq().filter(c => c.get('sectionId') === sectionId).toList().sortBy(c => c.get('index'));

    return (
      <div>
        <DefaultRedirect route={routes.catalog} params='catalogId' object={catalogs.get(0)} />
        <ListMenu
          route={routes.catalog}
          params='catalogId'
          items={catalogs}
          className={styles.shiftLeft}
        />
      </div>
    );
  }

});

export default CatalogsMenu;
