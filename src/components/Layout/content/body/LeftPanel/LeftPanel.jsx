import React, { Component } from 'react'
import { Row, Col } from 'antd'
import Header from './Header'

import styles from './leftPanel.less'

class LeftPanel extends Component {
  render() {
    return (
      <div className={styles.container}>
        <Col>
          <Header {...this.props} />
        </Col>

        <Col>
          <Row type="flex" className={styles.body}>
            <div>asdasasd
            asdasasdasas
            asdas
            sdfsdf
            </div>
          </Row>
        </Col>
      </div>
    )
  }
}

export default LeftPanel;
