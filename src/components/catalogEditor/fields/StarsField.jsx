import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Icon } from 'antd'
import styles from './fields.less'

const StarsField = React.createClass({
  mixins: [PureRenderMixin],
  render() {
    return (
      <div className={styles.typeStars}>
        <Icon className={styles.typeStarsItem} type="icon vote-38" />
        <Icon className={styles.typeStarsItem} type="icon vote-38" />
        <Icon className={styles.typeStarsItem} type="icon vote-38" />
        <Icon className={styles.typeStarsItem} type="icon vote-38" />
        <Icon className={styles.typeStarsItem} type="icon vote-38" />
      </div>
    );
  }

});

export default StarsField;
