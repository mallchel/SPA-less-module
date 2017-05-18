import React, { Component } from 'react'
import { CSSTransitionGroup } from 'react-transition-group'
import { Row } from 'antd'
import { Route } from 'react-router-dom'
import LeftPanel from './LeftPanel'
import RightPanel from './RightPanel'
import CatalogBody from './MiddlePanel'
import Splitter from '../../../common/Splitter'
// import NavRoute from '../../../common/router/Route'
import apiActions from '../../../../actions/apiActions'

import styleAnimation from './transitionGroup.less'
import styles from './body.less'

const ANIMATION_DELAY = 2000;

function ROW(props) {
  return (
    <Row type="flex" className={props.className}>
      {props.children}
    </Row>
  )
}

class Panels extends Component {
  componentDidMount() {
    apiActions.getCatalog({ catalogId: this.props.match.params.catalogId });
  }
  componentWillReceiveProps(nextProps) {

  }
  render() {
    const sectionId = this.props.match.params.sectionId;
    const section = this.props.appState.getIn(['sections', sectionId]);
    const currentCatalog = this.props.appState.get('currentCatalog');
    const currentCatalogId = this.props.appState.getIn(['currentCatalog','id']);
    const currentViewId = this.props.appState.getIn(['routeParams', 'viewId']);
    // console.log(currentCatalog, currentCatalogId, currentViewId)
    return (
      <Route path='/section/:sectionId/catalog/:catalogId/view/:viewId/records/:recordId'>
        {
          props => (
            <CSSTransitionGroup component={ROW}
              transitionName={{
                enter: styleAnimation.leftEnter,
                enterActive: styleAnimation.leftEnterActive,
                leave: styleAnimation.leftLeave,
                leaveActive: styleAnimation.leftLeaveActive,
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
                  enter: styleAnimation.rightEnter,
                  enterActive: styleAnimation.rightEnterActive,
                  leave: styleAnimation.rightLeave,
                  leaveActive: styleAnimation.rightLeaveActive,
                }}
                transitionEnterTimeout={ANIMATION_DELAY} transitionLeaveTimeout={ANIMATION_DELAY} transitionLeave={true}
              >
                <Route
                  path={'/section/:sectionId/catalog/:catalogId'}
                  component={CatalogBody}
                />
                {props.match && <Splitter><RightPanel {...props} /></Splitter>}
              </CSSTransitionGroup>
            </CSSTransitionGroup>
          )
        }
      </Route>
    )
  }
}

export default Panels;
