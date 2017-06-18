import React from 'react'
import classNames from 'classnames'
import trs from '../../../../../../../../../getTranslations'

import styles from './mainTab.less'

const AddBtn = React.createClass({
  propTypes: {
    icon: React.PropTypes.string,
    caption: React.PropTypes.node,
    captionCss: React.PropTypes.string
  },

  render() {
    if (this.props.readOnly) {
      return null;
    }

    let linkCss = classNames(styles.addButton, this.props.className);

    let icon = this.props.icon || 'interface-69';
    let iconCss = 'icon m-text_light record-append__icon anticon-icon ' + icon;

    let caption = this.props.caption || trs('record.addBtn');
    let captionCss = classNames(styles.addButtonText, this.props.captionCss);

    // Attention! in modal angular create eventlistener, which preventDefault click if no attr 'href' :)

    return (
      <div {...this.props} className={linkCss}>
        <span className={iconCss}> </span>
        <span className={captionCss}>{caption}</span>
      </div>
    );
  }
});

export default AddBtn;
