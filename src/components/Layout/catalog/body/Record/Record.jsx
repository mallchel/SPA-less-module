import React, { Component } from 'react'
import { Row } from 'antd'
import { Prompt } from 'react-router-dom'

class Record extends Component {
  render() {
    return (
      <Row>
        {/*<Prompt
          when={true}
          message={e => 'asdasdasd'}
        />*/}
        <div>Current catalog — {this.props.match.params.catalogId}</div>
      </Row>
    )
  }
}

export default Record;
