import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import ProgressField from '../../common/dataTypes/ProgressField';
import ChangeDirection from './ChangeDirection';

const ChangeProgress = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    change: React.PropTypes.object.isRequired,
    isNewRecord: React.PropTypes.bool
  },

  render() {
    let fromObj = null;
    if (this.props.change.get('oldValue') != null && !this.props.isNewRecord) {
      fromObj = <ProgressField value={this.props.change.get('oldValue')} config={this.props.config} />;
    }
    let toObj = null;
    if (this.props.change.get('newValue') != null) {
      toObj = <ProgressField value={this.props.change.get('newValue')} config={this.props.config} />;
    }
    return (<ChangeDirection fromObj={fromObj} toObj={toObj} />);
  }
});

export default ChangeProgress;
