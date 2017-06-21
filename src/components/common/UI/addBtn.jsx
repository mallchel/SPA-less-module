import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import classNames from 'classnames';
import trs from '../../../getTranslations';

const AddBtn = React.createClass({
  propTypes: {
    icon: React.PropTypes.string,
    caption: React.PropTypes.node,
    captionCss: React.PropTypes.string
  },

  render() {
    if ( this.props.readOnly ) {
      return null;
    }

    let linkCss = classNames('m-text_muted', this.props.className);

    let icon = this.props.icon || 'interface-69';
    let iconCss = 'icon m-text_light record-append__icon icon--' + icon;

    let caption = this.props.caption || trs('record.addBtn');
    let captionCss = classNames(this.props.captionCss);

    // Attention! in modal angular create eventlistener, which preventDefault click if no attr 'href' :)

    return (
      <a {...this.props} className={linkCss} href="javascript:void(0)">
        <span className={iconCss}> </span>
        <span className={captionCss}>{caption}</span>
      </a>
    );
  }
});

export default AddBtn;
