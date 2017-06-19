import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Row } from 'antd'
import { formatDate } from '../../../../../../../../../utils/formatDate'

import styles from './linkedData.less'

const LinkedRecord = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    record: React.PropTypes.object.isRequired,
    onClickRecord: React.PropTypes.func
  },

  onClickName(e) {
    e.preventDefault();
    this.props.onClickRecord(this.props.record.get('id'), this.props.record.get('title'));
  },

  render() {
    let record = this.props.record;
    return (
      <Row type="flex" justify="space-between" align="middle" onClick={this.onClickName} className={styles.linkedRecordContainer}>
        <div>
          <span className={styles.linkedRecordId}>{record.get('id')}</span>
          <span>{record.get('title')}</span>
        </div>
        <span><small>{formatDate(record.get('created'))}</small></span>
      </Row>
    );
  }

});

export default LinkedRecord;
