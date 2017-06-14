import React, { Component } from 'react'
import CatalogHeader from './CatalogHeader'
import CatalogBody from './CatalogBody'

import styles from './layoutLeftPanel.less'

class LayoutLeftPanel extends Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <CatalogHeader
            {...this.props}
          />
        </div>

        <CatalogBody
          catalog={this.props.catalog}
        />
      </div>
    )
  }
}

export default LayoutLeftPanel;
