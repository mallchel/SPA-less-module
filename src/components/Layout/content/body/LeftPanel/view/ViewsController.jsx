import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ViewsList from './ViewsList';
import apiActions from '../../../../../../actions/apiActions';
import viewActions from '../../../../../../actions/viewActions';
import Immutable from 'immutable';

const ViewsController = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    currentViewId: React.PropTypes.string,
    currentCatalogId: React.PropTypes.string,
    currentCatalog: React.PropTypes.object
  },

  loadCatalog(catalogId) {
    if (catalogId)
      apiActions.getViews({ catalogId })
  },

  loadView(viewId, catalogId) {
    if (viewId && catalogId)
      viewActions.preGetView({ viewId, catalogId });
  },

  componentWillMount() {
    this.loadCatalog(this.props.currentCatalogId);
    this.loadView(this.props.currentViewId, this.props.currentCatalogId);
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentCatalogId && nextProps.currentCatalogId !== this.props.currentCatalogId) {
      this.loadCatalog(nextProps.currentCatalogId);
    }
    if (nextProps.currentViewId && nextProps.currentViewId !== this.props.currentViewId) {
      this.loadView(nextProps.currentViewId, nextProps.currentCatalogId);
    }
  },

  // onSelectViewItem(viewId) {
  //   // apply filters to FilterStore.
  //   // route.go to viewId
  //   return viewActions.selectView(viewId, this.props.currentCatalogId);
  // },

  render() {
    let views = (this.props.currentCatalog && this.props.currentCatalog.get('views')) ||
      new Immutable.List();
    // get views from currentCatalog.
    return <ViewsList
      currentCatalog={this.props.currentCatalog}
      currentViewId={this.props.currentViewId}
      currentCatalogId={this.props.currentCatalogId}
      views={views}
    />;
  }
});

export default ViewsController;
