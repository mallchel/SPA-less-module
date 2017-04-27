import React, { Component } from 'react'
import { Link, Redirect, Prompt } from 'react-router-dom'
import { Row, Button, Icon } from 'antd'
import routes from '../../../../routes'
import NavRoute from '../../../common/router/Route'
import Record from './Record'
import CatalogBody from './CatalogBody'
import View from './View'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import Splitter from '../../../common/Splitter'
import styleAnimation from './transitionGroup.less'
import styles from './body.less'

const ANIMATION_DELAY = 2000;

/*function ViewCol(props) {
  return (
    <Col style={{ width: '300px' }}>
      <View key={props.match.params.catalogId} />
    </Col>
  )
}*/

/*function CatalogCol(props) {
  return (
    <Col style={{ maxWidth: '100%', overflow: "hidden", flexGrow: '1', flexBasis: '0', minWidth: '400px' }}>
      <CatalogBody {...props} />
    </Col>
  )
}*/

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
  state = {
    visible: false
  }
  show = () => {
    this.setState({ visible: true });
  }
  handleOk = () => {
    console.log('ok')
    this.setState({ visible: false });
  }
  handleCancel = () => {
    console.log('cancel', this.state.visible)
    this.setState({ visible: false });
  }
  handleButtonClick = (e) => {
    console.log('click left button', e);
  }

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
                    component={View}
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
                  {props.match && <Splitter><Record {...props} /></Splitter>}
                </ReactCSSTransitionGroup>
              </ReactCSSTransitionGroup>
            )
          }
        </NavRoute>
        <img src="img.png" alt=""/>

        <Link to={'/section/1/catalog/1/view/1/1'} onClick={e => this.setState({ record: false })}>View</Link>&nbsp;
        <Link to={'/section/1/catalog/1/view/1/1/record/1'} onClick={e => this.setState({ record: true })}>Record</Link>

        <br />

        <Button type="dashed" icon="content-43"/>
        <button>
          <Icon type="content-43" />
        </button>
      </div>
    )
  }
}

export default Body;
