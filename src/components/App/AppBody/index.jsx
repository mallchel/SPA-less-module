import React from 'react'
import { Route } from 'react-router-dom'
import { matchPath } from 'react-router'
import NavRoute from '../../common/router/Route'
import routes from '../../../routes'
import Section from './Section'
import LayoutCatalogEditor from './LayoutCatalogEditor'

import styles from './appBody.less'

const AppBody = function () {
  return (
    <div className={styles.container}>
      <Route render={props => {
        const { location } = props;
        const matchEdit = matchPath(location.pathname, {
          path: routes.catalogEdit.path,
          exact: true,
          strict: false
        });
        const matchAdd = matchPath(location.pathname, {
          path: routes.catalogAdd.path,
          exact: true,
          strict: false
        });
        if (matchEdit) {
          return <NavRoute route={routes.catalogEdit} render={props => {
            return <LayoutCatalogEditor isStateEditCatalog={true} />
          }} />

        } else if (matchAdd) {
          return <NavRoute route={routes.catalogAdd} render={props => {
            return <LayoutCatalogEditor isStateAddCatalog={true} />
          }} />
        } else {
          return <NavRoute route={routes.section} component={Section} />
        }
      }} />
    </div>
  )
}

export default AppBody;