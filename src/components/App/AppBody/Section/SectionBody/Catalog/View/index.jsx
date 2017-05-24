import React, { Component } from 'react'
import { Row, Col } from 'antd'
import PropTypes from 'prop-types'
import viewActions from '../../../../../../../actions/viewActions'
import ViewHeader from './ViewHeader'

import styles from './view.less'

class View extends Component {
  static PropTypes = {
    catalog: PropTypes.object,
    viewId: PropTypes.string
  }

  loadView(viewId, catalogId) {
    if (viewId && catalogId)
      viewActions.preGetView({ viewId, catalogId });
  }

  componentWillMount() {
    const catalogId = this.props.catalog && this.props.catalog.get('id');
    this.loadView(this.props.viewId, catalogId);
  }

  componentWillReceiveProps(nextProps) {
    const prevCatalogId = this.props.catalog && this.props.catalog.get('id');
    const catalogId = nextProps.catalog && nextProps.catalog.get('id');

    if (catalogId && catalogId !== prevCatalogId) {
      this.loadView(nextProps.viewId, catalogId);
    }

    if (nextProps.viewId && nextProps.viewId !== this.props.viewId) {
      this.loadView(nextProps.viewId, catalogId);
    }
  }
  render() {
    return (
      <div className={styles.container}>
        <Col>
          <ViewHeader />
        </Col>
        <Col>
          <Row className={styles.body}>
            sadasdasdasd
        </Row>
        </Col>
      </div>
    )
  }
}

export default View;
