import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import _ from 'lodash'

import NumberField from '../../common/dataTypes/NumberField'
import ChangeDirection from './ChangeDirection'

const ChangeNumber = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    change: React.PropTypes.object.isRequired,
    config: React.PropTypes.object.isRequired,
    isNewRecord: React.PropTypes.bool
  },
  empty(value) {
    return _.isUndefined(value) || _.isNull(value);
  },
  render() {
    const fromObj = (!this.empty(this.props.change.get('oldValue')) ? <NumberField value={this.props.change.get('oldValue')} config={this.props.config} /> : null);
    const toObj = (!this.empty(this.props.change.get('newValue')) ? <NumberField value={this.props.change.get('newValue')} config={this.props.config} withUnit={true} /> : null);

    return (<ChangeDirection fromObj={fromObj} toObj={toObj} />);
  }
});

export default ChangeNumber;
