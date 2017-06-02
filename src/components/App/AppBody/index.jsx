import React from 'react'
import NavRoute from '../../common/router/Route'
import routes from '../../../routes'
import Section from './Section'

import styles from './appBody.less'

const AppBody = function () {
  return (
    <div className={styles.container}>
      <NavRoute route={routes.section} render={props => {
        return <Section
          sectionId={props.match.params.sectionId}
        />
      }} />
    </div>
  )
}

export default AppBody;
