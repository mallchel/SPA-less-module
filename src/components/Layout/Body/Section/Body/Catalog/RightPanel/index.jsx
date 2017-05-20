import React, { Component } from 'react'
import { Row, Col } from 'antd'
import { Prompt } from 'react-router-dom'

import styles from './rightPanel.less'

class RightPanel extends Component {
  render() {
    return (
      <div className={styles.container}>
        {/*<Prompt
          when={true}
          message={e => 'asdasdasd'}
        />*/}

        <Col>
          <Row className={styles.header}>

          </Row>
        </Col>
        <Col>
          <Row className={styles.body}>
            <div>Current catalog — {this.props.match.params.catalogId}</div>
          </Row>
        </Col>
      </div>
    )
  }
}

export default RightPanel;
