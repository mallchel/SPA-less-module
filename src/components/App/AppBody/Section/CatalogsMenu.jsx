import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
// import Immutable from 'immutable'
import PropTypes from 'prop-types'
import _ from 'lodash'
// import catalogActions from '../../../../actions/catalogActions'
import apiActions from '../../../../actions/apiActions'
// import changeMapOrder from '../../../utils/changeMapOrder'
import DefaultRedirect from '../../../common/router/DefaultRedirect'
import routes from '../../../../routes'
import catalogActions from '../../../../actions/catalogActions'

import ListMenu from '../../../common/menu/ListMenu'
import styles from './section.less'

const CatalogsMenu = React.createClass({
  priorities: null,
  mixins: [PureRenderMixin],
  propTypes: {
    sectionId: PropTypes.string,
    catalogs: PropTypes.object.isRequired,
  },

  componentDidMount() {
    const sectionId = this.props.sectionId;
    if (sectionId) {
      apiActions.getCatalogs({ sectionId });
    }
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.sectionId !== nextProps.sectionId) {
      apiActions.getCatalogs({ sectionId: nextProps.sectionId });
    }
  },

  saveToServer(order) {
    catalogActions.changeSortIndex(order);
    apiActions.updateSection({
      sectionId: this.props.sectionId
    }, {
        catalogsPriorities: order
      });
  },

  render() {
    const sectionId = this.props.sectionId;
    const catalogs = this.props.catalogs.valueSeq().filter(c => c.get('sectionId') === sectionId).sortBy(c => c.get('index'));

    return (
      <div>
        <DefaultRedirect route={routes.catalog} params='catalogId' object={catalogs.get(0)} />
        <ListMenu
          route={routes.catalog}
          params='catalogId'
          items={catalogs}
          className={styles.shiftLeft}
          canDrag={this.props.isAccessAdmin}
          onDragEnd={this.saveToServer}
          dragType='catalog'
        />
      </div>
    );
  }

});

export default CatalogsMenu;
