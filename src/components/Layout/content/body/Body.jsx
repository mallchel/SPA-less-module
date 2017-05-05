import React, { Component } from 'react'
import { Link, Redirect, Prompt } from 'react-router-dom'
import { Row } from 'antd'
import routes from '../../../../routes'
import NavRoute from '../../../common/router/Route'
import RightPanel from './RightPanel'
import CatalogBody from './MiddlePanel'
import LeftPanel from './LeftPanel'
import { CSSTransitionGroup } from 'react-transition-group'
import Splitter from '../../../common/Splitter'
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

class Body extends Component {
  render() {
    return (
      <div className={styles.body}>
        <Prompt
          when={true}
          message={e => 'Вы изменили запись «», но не сохранили её. Закрыть запись без сохранения?'}
        />
        <NavRoute route={routes.catalog}>
          {props => {
            if (props.match && props.match.isExact) {
              return <Redirect to={props.location.pathname + '/view/2/1'} />
            }

            return null;
          }}
        </NavRoute>

        <NavRoute route={routes.record}>
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
                  <NavRoute
                    route={routes.tab}
                    component={LeftPanel}
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
                  <NavRoute
                    route={routes.view}
                    component={CatalogBody}
                  />
                  {props.match && <Splitter><RightPanel {...props} /></Splitter>}
                </CSSTransitionGroup>
              </CSSTransitionGroup>
            )
          }
        </NavRoute>

        <Link to={'/section/1/catalog/1/view/1/1'}>View</Link>&nbsp;
        <Link to={'/section/1/catalog/1/view/1/1/record/1'}>Record</Link>

      </div>
    )
  }
}

export default Body;
