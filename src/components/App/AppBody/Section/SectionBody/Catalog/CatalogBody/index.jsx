import React from 'react'
import NavRoute from '../../../../../../common/router/Route'
import routes from '../../../../../../../routes'
import ViewsMenu from './ViewsMenu'
import Filter from './Filter'

const CatalogBody = function ({ ...props }) {
  const { catalog } = props;
  return (
    <div>
      <ViewsMenu
        catalog={props.catalog}
      />
      <NavRoute route={routes.view} children={props => {
        return (
          <Filter
            catalog={catalog}
            viewId={props.match && props.match.params.viewId}
          />
        )
      }}
      />
    </div>
  )
}

export default CatalogBody;
