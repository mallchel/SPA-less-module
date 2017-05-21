import React, { Component } from 'react'
import Header from './Header'
import ViewsController from './view/ViewsController'
import FilterController from './filter/FilterController'

import styles from './leftPanel.less'

class LeftPanel extends Component {
  render() {
    return (
      <div className={styles.container}>
        <div>
          <Header
            currentCatalog={this.props.currentCatalog}
            section={this.props.section}
          />
        </div>

        <div className={styles.body}>
          <ViewsController
            currentViewId={this.props.currentViewId}
            currentCatalogId={this.props.currentCatalogId}
            currentCatalog={this.props.currentCatalog}
          />
          <FilterController
            currentCatalogId={this.props.currentCatalogId}
            currentCatalog={this.props.currentCatalog}
          />
        </div>
      </div>
    )
  }
}

export default LeftPanel;
