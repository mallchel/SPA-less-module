import React, { Component } from 'react'
// import { Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import apiActions from '../../../actions/apiActions'
import NavRoute from '../../common/router/Route'
import routes from '../../../routes'
import HeaderCatalog from './HeaderCatalog'
import Body from './body/Body'

import styles from './content.less'

class Content extends Component {
  static propTypes = {
    appState: PropTypes.object.isRequired
  }
  componentDidMount() {
    apiActions.getCatalogs();

    const sectionId = this.props.appState.getIn(['route', 'params', 'sectionId']);
    if (sectionId) {
      apiActions.getSection({ sectionId });
    }
  }
  componentWillReceiveProps(nextProps) {
    const newSectionId = nextProps.appState.getIn(['route', 'params', 'sectionId']);

    if (newSectionId && this.props.appState.getIn(['route', 'params', 'sectionId']) !== newSectionId) {
      // update catalogs.
      apiActions.getCatalogs();
      apiActions.getSection({ sectionId: newSectionId });
    }
  }
  render() {
    const sectionId = this.props.appState.getIn(['route', 'params', 'sectionId']);
    const catalogs = this.props.appState.get('catalogs').valueSeq().filter(c => c.get('sectionId') === sectionId);
    const section = this.props.appState.getIn(['sections', sectionId]);
    const currentCatalog = this.props.appState.get('currentCatalog');

    return (
      <div className={styles.container}>
        <NavRoute route={routes.section} render={props => (
          <HeaderCatalog
            sectionId={sectionId}
            catalogs={catalogs}
            section={section}
            currentCatalog={currentCatalog}
            {...props}
          />
        )} />
        <Body { ...this.props } />
      </div>
    )
  }
}

export default Content;
