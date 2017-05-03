import React, { Component } from 'react'
import { Link, Redirect, Prompt } from 'react-router-dom'
import { Row } from 'antd'
import routes from '../../../../routes'
import NavRoute from '../../../common/router/Route'
import RightPanel from './RightPanel'
import CatalogBody from './MiddlePanel'
import LeftPanel from './LeftPanel'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import Splitter from '../../../common/Splitter'
import styleAnimation from './transitionGroup.less'
import Modal from '../../../common/Modal'
import styles from './body.less'

const ANIMATION_DELAY = 2000;

function RowParent(props) {
  return (
    <Row type="flex">
      {props.children}
    </Row>
  )
}

function ROW(props) {
  return (
    <Row type="flex" className={styles.childTransitionGroup}>
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
        {/*<Modal {...this.props} component={RightPanel}/>*/}
        <NavRoute route={routes.record}>
          {
            props => (
              <ReactCSSTransitionGroup component={RowParent}
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
                <ReactCSSTransitionGroup component={ROW}
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
                </ReactCSSTransitionGroup>
              </ReactCSSTransitionGroup>
            )
          }
        </NavRoute>
        {/*<img src="img.png" alt=""/>*/}

        <Link to={'/section/1/catalog/1/view/1/1'}>View</Link>&nbsp;
        <Link to={'/section/1/catalog/1/view/1/1/record/1'}>Record</Link>

      </div>
    )
  }
}

export default Body;
