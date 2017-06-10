import React from 'react'
// import PureRenderMixin from 'react-addons-pure-render-mixin'
import cn from 'classnames'
import Immutable from 'immutable'
import apiActions from '../../../../../../../../actions/apiActions'
import DefaultRedirect from '../../../../../../../common/router/DefaultRedirect'
import StateRedirect from '../../../../../../../common/router/StateRedirect'
import NavRoute from '../../../../../../../common/router/Route'
import ViewsMenuItem from './ViewsMenuItem'
import routes from '../../../../../../../../routes'

import styles from './viewsMenu.less'

const ViewsMenu = React.createClass({
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
    const views = this.props.catalog && this.props.catalog.get('views');
    const viewsList = (views && views.valueSeq().sortBy(c => c.get('index'))) || new Immutable.List();

    // get views from current Catalog.
    const firstView = viewsList.get(0);
    const newView = views && views.filter(v => v.get('id') === '$new').size;

    return (
      <div className={styles.container}>
        <DefaultRedirect route={routes.view} params='viewId' object={firstView} />
        {
          <NavRoute route={routes.view}>
            {({ match }) => {
              if (match && match.params.viewId && views && !views.get(match.params.viewId)) {
                return <StateRedirect route={routes.view} params={{ viewId: firstView && firstView.get('id') }} />
              }
              return null;
            }}
          </NavRoute>
        }
        <ul className={cn('ant-menu-inline', styles.menu, { [styles.nonNewView]: !newView })}>
          {
            viewsList.size
              ? viewsList.map((view, i) => {
                return <ViewsMenuItem
                  key={view.get('id')}
                  catalog={this.props.catalog}
                  rights={view.get('forRights')}
                  view={view}
                />
              })
              : null
          }
        </ul>
      </div>
    )
  }
});

export default ViewsMenu;
