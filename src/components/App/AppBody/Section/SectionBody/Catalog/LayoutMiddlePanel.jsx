import React from 'react'
import NavRoute from '../../../../../common/router/Route'
import routes from '../../../../../../routes'
import View from './View'

import styles from './layoutMiddlePanel.less'

const LayoutMiddlePanel = function ({ catalog }) {
  return (
    <div className={styles.container}>
      <NavRoute route={routes.view} render={props => {
        return <View
          catalog={catalog}
          viewId={props.match && props.match.params.viewId}
        />
      }} />
    </div>
  )
}

export default LayoutMiddlePanel;
