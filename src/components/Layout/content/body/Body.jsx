import React, { Component } from 'react'
import { Link, Redirect, Prompt, Route } from 'react-router-dom'
import NavRoute from '../../../common/router/Route'
import Panels from './Panels'

import styles from './body.less'

class Body extends Component {
  render() {
    return (
      <div className={styles.body}>
        {/*<Prompt
          when={true}
          message={e => 'Вы изменили запись «», но не сохранили её. Закрыть запись без сохранения?'}
        />*/}
        {/*<NavRoute route='/section/:sectionId/catalog/:catalogId'>
          {props => {
            if (props.match && props.match.isExact) {
              return <Redirect to={props.location.pathname + '/view/1'} />
            }

            return null;
          }}
        </NavRoute>*/}
        <Route path='/section/:sectionId/catalog/:catalogId' render={props => (
          <Panels { ...this.props } {...props} />
        )} />

        <Link to={'/section/1/catalog/1/view/1'}>View</Link>&nbsp;
        <Link to={'/section/1/catalog/1/view/1/records/1'}>Record</Link>

      </div>
    )
  }
}

export default Body;
