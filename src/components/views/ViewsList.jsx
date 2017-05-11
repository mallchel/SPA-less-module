import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Immutable from 'immutable';
import trs from '../../getTranslations';
import ViewItem from './ViewItem';

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
        selected={ newView.size == 0 && view.get('id') == (this.props.currentViewId || 0) }
        rights={view.get('forRights')}
        view={view} onClick={this.props.onSelectViewItem}/>
    });


    return (
      <section className="views-container">
        { views.size ?
          <div className="sidebar nunit-list nunit-list--with-badges nunit-list--with-icons">
            {views}
            { newView.size == 0 ? <div style={{height: '36px'}} >&nbsp;</div> : null }
          </div> :
          <div />
        }
      </section>
    );
  }
});

export default ViewsList;
