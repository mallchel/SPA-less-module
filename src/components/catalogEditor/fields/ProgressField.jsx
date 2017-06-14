import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import styles from './fields.less'

const ProgressField = React.createClass({
  mixins: [PureRenderMixin],
  render() {
    return (
      <div className={styles.typeProgress}>
        <span>0 — 100%</span>
      </div>
    );
  }

});

export default ProgressField;
