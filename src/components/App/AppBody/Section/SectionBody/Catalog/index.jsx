import React, { Component } from 'react'
import { CSSTransitionGroup } from 'react-transition-group'
import { Row } from 'antd'
import { Route } from 'react-router-dom'
import LayoutLeftPanel from './LayoutLeftPanel'
import LayoutMiddlePanel from './LayoutMiddlePanel'
import LayoutRightPanel from './LayoutRightPanel'
import Splitter from '../../../../../common/Splitter'
import NavRoute from '../../../../../common/router/Route'
import routes from '../../../../../../routes'
import apiActions from '../../../../../../actions/apiActions'
import catalogActions from '../../../../../../actions/catalogActions'
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
  catalogActions.preGetCatalog({ catalogId });
  userSettingsActions
    .getUserSettingsForCatalog({ catalogId })
    .then(function () {
      apiActions.getCatalog({ catalogId });
    });
}

class Catalog extends Component {
  componentDidMount() {
    loadCatalog(this.props.catalogId);
  }
  componentWillReceiveProps(nextProps) {
    // todo: and check viewId.
    if (nextProps.catalogId !== this.props.catalogId) {
      loadCatalog(nextProps.catalogId);
    }
  }
  render() {
    const catalogId = this.props.catalogId;
    const catalog = this.props.appState.getIn(['catalogs', catalogId]);

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
                    <LayoutLeftPanel
                      catalog={catalog}
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
                  render={props => (
                    <LayoutMiddlePanel
                      catalog={catalog}
                    />
                  )}
                />
                {props.match && <Splitter><LayoutRightPanel {...props} /></Splitter>}
              </CSSTransitionGroup>
            </CSSTransitionGroup>
          )

        }
      </NavRoute>
    )
  }
}

export default Catalog;
