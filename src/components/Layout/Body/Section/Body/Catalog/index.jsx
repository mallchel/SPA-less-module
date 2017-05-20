import React, { Component } from 'react'
import { CSSTransitionGroup } from 'react-transition-group'
import { Row } from 'antd'
import { Route } from 'react-router-dom'
import LeftPanel from './LeftPanel'
import RightPanel from './RightPanel'
import MiddlePanel from './MiddlePanel'
import Splitter from '../../../../../common/Splitter'
import NavRoute from '../../../../../common/router/Route'
import routes from '../../../../../../routes'
import apiActions from '../../../../../../actions/apiActions'
import userSettingsActions from '../../../../../../actions/userSettingsActions'

import styles from './catalog.less'

const ANIMATION_DELAY = 2000;

function ROW(props) {
  return (
    <Row type="flex" className={props.className}>
      {props.children}
    </Row>
  )
}

function loadCatalog(catalogId) {
  userSettingsActions
    .getUserSettingsForCatalog({ catalogId })
    .then(function () {
      apiActions.getCatalog({ catalogId });
    });
}

class Catalog extends Component {
  componentDidMount() {
    loadCatalog(this.props.appState.getIn(['route', 'params', 'catalogId']));
  }
  componentWillReceiveProps(nextProps) {
    // todo: and check viewId.
    if (nextProps.appState.getIn(['route', 'params', 'catalogId']) !== this.props.appState.getIn(['route', 'params', 'catalogId'])) {
      loadCatalog(nextProps.appState.getIn(['route', 'params', 'catalogId']));
    }
  }
  render() {
    const sectionId = this.props.match.params.sectionId;
    const section = this.props.appState.getIn(['sections', sectionId]);
    const currentCatalog = this.props.appState.get('currentCatalog');
    const currentCatalogId = this.props.appState.getIn(['currentCatalog', 'id']);
    const currentViewId = this.props.appState.getIn(['route', 'params', 'viewId']);

    return (
      <NavRoute route={routes.record}>
        {
          props => (
            <CSSTransitionGroup component={ROW}
              transitionName={{
                enter: styles.leftEnter,
                enterActive: styles.leftEnterActive,
                leave: styles.leftLeave,
                leaveActive: styles.leftLeaveActive,
              }}
              transitionEnterTimeout={ANIMATION_DELAY} transitionLeaveTimeout={ANIMATION_DELAY} transitionLeave={true}
            >
              {!props.match && (
                <Route
                  path={'/section/:sectionId/catalog/:catalogId'}
                  render={props => (
                    <LeftPanel
                      section={section}
                      currentCatalog={currentCatalog}
                      currentCatalogId={currentCatalogId}
                      currentViewId={currentViewId}
                    />
                  )}
                />
              )}
              <CSSTransitionGroup component={ROW}
                className={styles.childTransitionGroup}
                transitionName={{
                  enter: styles.rightEnter,
                  enterActive: styles.rightEnterActive,
                  leave: styles.rightLeave,
                  leaveActive: styles.rightLeaveActive,
                }}
                transitionEnterTimeout={ANIMATION_DELAY} transitionLeaveTimeout={ANIMATION_DELAY} transitionLeave={true}
              >
                <Route
                  path={'/section/:sectionId/catalog/:catalogId'}
                  component={MiddlePanel}
                />
                {props.match && <Splitter><RightPanel {...props} /></Splitter>}
              </CSSTransitionGroup>
            </CSSTransitionGroup>
          )
        }
      </NavRoute>
    )
  }
}

export default Catalog;
