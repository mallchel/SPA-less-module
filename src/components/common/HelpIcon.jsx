import React from 'react';

import trs from '../../getTranslations';

const PropTypes = React.PropTypes;

const HelpIcon = React.createClass({
  propTypes: {
    helpPath: PropTypes.string.isRequired,
    helpTitle: PropTypes.string,
    icon: PropTypes.string,
    inBlank: PropTypes.bool
  },
  getDefaultProps: function() {
    return {
      helpPath: '',
      helpTitle: trs('buttons.help'),
      icon: 'icon icon--interface-56 m-text_light help-link',
      inBlank: true
    };
  },
  render() {
    return (
      <a href={`http://docs.bpium.ru/${this.props.helpPath}`} target={this.props.inBlank?'_blank':null} title={this.props.helpTitle}>
        <span className={this.props.icon}></span>
      </a>
    );
  }

});

export default HelpIcon;
