import React from 'react'
// import PureRenderMixin from 'react-addons-pure-render-mixin'
import cn from 'classnames'
import Immutable from 'immutable'
import apiActions from '../../../../../../../../actions/apiActions'
import DefaultRedirect from '../../../../../../../common/router/DefaultRedirect'
import ViewsMenuItem from './ViewsMenuItem'
import routes from '../../../../../../../../routes'

import styles from './viewsMenu.less'

const ViewsMenu = React.createClass({
  // mixins: [PureRenderMixin],
  propTypes: {
    catalog: React.PropTypes.object
  },

  loadViews(catalogId) {
    if (catalogId)
      apiActions.getViews({ catalogId });
  },

  componentWillMount() {
    const catalogId = this.props.catalog && this.props.catalog.get('id');
    this.loadViews(catalogId);
  },

  componentWillReceiveProps(nextProps) {
    const prevCatalogId = this.props.catalog && this.props.catalog.get('id');
    const catalogId = nextProps.catalog && nextProps.catalog.get('id');

    if (catalogId && catalogId !== prevCatalogId) {
      this.loadViews(catalogId);
    }
  },

  render() {
    let views = (this.props.catalog && this.props.catalog.get('views')) ||
      new Immutable.OrderedMap();

    // get views from current Catalog.
    const firstView = views.get('0');
    views = views.valueSeq().sortBy(c => c.get('index')).map((view, i) => {
      return <ViewsMenuItem
        key={view.get('id')}
        catalog={this.props.catalog}
        rights={view.get('forRights')}
        view={view}
      />
    });

    return (
      <div>
        <DefaultRedirect route={routes.view} params='viewId' object={firstView} />

        <ul className={cn('ant-menu-inline', styles.menu)}>
          {
            views.size ?
              views
              :
              null
          }
        </ul>
      </div>
    )
  }
});

export default ViewsMenu;
