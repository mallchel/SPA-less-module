import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import cn from 'classnames'
import ViewItem from './ViewItem'
import DefaultRedirect from '../../../../../../../common/router/DefaultRedirect'

import styles from './viewList.less'

const ViewsList = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    views: React.PropTypes.object,
    currentCatalogId: React.PropTypes.string,
    currentCatalog: React.PropTypes.object,
    currentViewId: React.PropTypes.string,
  },

  render() {
    let views = this.props.views;

    views = views.map(view => {
      return <ViewItem
        key={view.get('id')}
        currentCatalog={this.props.currentCatalog}
        currentCatalogId={this.props.currentCatalogId}
        rights={view.get('forRights')}
        view={view}
      />
    });

    return (
      <ul className={cn('ant-menu-inline', styles.menu)}>
        <DefaultRedirect route='view' path='/view/:viewId' object={this.props.views.get(0)} />
        {
          views.size ?
            views
            :
            null
        }
      </ul>
    );
  }
});

export default ViewsList;
