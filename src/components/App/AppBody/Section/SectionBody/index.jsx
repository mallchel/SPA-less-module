import React, { Component } from 'react'
import NavRoute from '../../../../common/router/Route'
import routes from '../../../../../routes'
import Catalog from './Catalog'

import styles from './sectionBody.less'

class SectionBody extends Component {
  render() {
    return (
      <div className={styles.body}>
        <NavRoute route={routes.catalog} component={Catalog} />
      </div>
    )
  }
}

export default SectionBody;
