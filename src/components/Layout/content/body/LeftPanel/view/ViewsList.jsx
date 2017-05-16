import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Link } from 'antd'
import cn from 'classnames'
import ViewItem from './ViewItem'

import styles from './viewList.less'

const ViewsList = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    views: React.PropTypes.object,
    currentCatalogId: React.PropTypes.string,
    currentCatalog: React.PropTypes.object,
    currentViewId: React.PropTypes.string,
    onSelectViewItem: React.PropTypes.func
  },

  render() {
    let views = this.props.views;
    let newView = views.filter(v => v.get('isNew'));

    views = views.map(view => {
      return <ViewItem
        key={view.get('id')}
        currentCatalog={this.props.currentCatalog}
        currentCatalogId={this.props.currentCatalogId}
        selected={newView.size === 0 && view.get('id') === (this.props.currentViewId || 0)}
        rights={view.get('forRights')}
        view={view} onClick={this.props.onSelectViewItem} />
    });


    return (
      <ul className={cn('ant-menu-inline', styles.menu)}>
        {views.size ?
          views.map(view => {
            console.log(views.toJS(), this.props)
            return (
              <li key={view.key} className="ant-menu-item">
                {/*<Link to={``}/>*/}
                {view}
                {newView.size === 0 ? <div style={{ height: '36px' }} >&nbsp;</div> : null}
              </li>
            )
          })
          :
          null
        }
      </ul>
    );
  }
});

export default ViewsList;
