import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import StarsField from '../../common/dataTypes/StarsField';
import ChangeDirection from './ChangeDirection'

const ChangeStars = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    change: React.PropTypes.object.isRequired,
    config: React.PropTypes.object.isRequired,
    isNewRecord: React.PropTypes.bool
  },

  render() {
    const fromObj = <StarsField value={this.props.change.get('oldValue')} config={this.props.config} />;
    const toObj = <StarsField value={this.props.change.get('newValue')} config={this.props.config} />;

    return (<ChangeDirection fromObj={fromObj} toObj={toObj} strikeRemoved={false} />);
  }

});

export default ChangeStars;
