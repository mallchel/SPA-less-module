import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import trs from '../../getTranslations';
import classNames from 'classnames';

import Spinner from './LoadingSpinner';

const log = require('debug')('CRM:Component:Common:Loading');

const Loading = React.createClass({

  mixins: [PureRenderMixin],
  propTypes: {
    text: React.PropTypes.string,
    fullHeight: React.PropTypes.bool,
    info: React.PropTypes.string,
    error: React.PropTypes.string,
    success: React.PropTypes.string,
    styles: React.PropTypes.object
  },

  render() {
    log('render');

    var text = this.props.error || this.props.success || this.props.info || this.props.text;
    
    if (!text && text !== '') {
      text = trs('loadingText');
    }
    
    var classes = classNames({
      'loading': true,
      'loading--full-height': this.props.fullHeight,
      'loading--error': this.props.error,
      'loading--success': !this.props.error && this.props.success,
      'loading--info': !this.props.error && !this.props.success && this.props.info
    });

    return (
      <div className={classes} style={this.props.styles}>
        <div className="loading__helper"></div>
        <Spinner />
        <span className="loading__error-icon icon icon--interface-57" />
        <span className="loading__success-icon icon icon--status-17" />
        <span className="loading__text">{text}</span>
      </div>
    );
  }

});

export default Loading;
