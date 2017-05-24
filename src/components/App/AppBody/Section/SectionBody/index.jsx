import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import NavRoute from '../../../../common/router/Route'
import routes from '../../../../../routes'
import Catalog from './Catalog'

import styles from './sectionBody.less'

class SectionBody extends Component {
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
        {/*<Route path='/section/:sectionId/catalog/:catalogId' render={props => (
          <Panels { ...this.props } {...props} />
        )} />*/}
        <NavRoute route={routes.catalog} render={props => {
          return <Catalog { ...this.props }
            catalogId={props.match.params.catalogId}
          />
        }} />

        <Link to={'/section/1/catalog/1/view/0'}>View</Link>&nbsp;
        <Link to={'/section/1/catalog/1/view/0/records/1'}>Record</Link>

      </div>
    )
  }
}

export default SectionBody;
