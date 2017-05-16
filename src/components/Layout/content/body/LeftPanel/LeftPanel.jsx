import React, { Component } from 'react'
import { Row, Col } from 'antd'
import Header from './Header'
import ViewsController from './view/ViewsController'

import styles from './leftPanel.less'

class LeftPanel extends Component {
  render() {
    return (
      <div className={styles.container}>
        <Col>
          <Header
            currentCatalog={this.props.currentCatalog}
            section={this.props.section}
          />
        </Col>

        <Col>
          <Row type="flex" className={styles.body}>
            <ViewsController
              currentViewId={this.props.currentViewId}
              currentCatalogId={this.props.currentCatalogId}
              currentCatalog={this.props.currentCatalog}
            />
          </Row>
        </Col>
      </div>
    )
  }
}

export default LeftPanel;
