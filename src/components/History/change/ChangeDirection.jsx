import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import _ from 'lodash'

const ChangeDirection = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    fromObj: React.PropTypes.object,
    toObj: React.PropTypes.object.isRequired,
    containerClass: React.PropTypes.string
  },

  render() {
    let strikeRemoved = this.props.strikeRemoved !== false;
    let oldClass = null;
    if (strikeRemoved && _.isEmpty(this.props.toObj) && !_.isEmpty(this.props.fromObj)) {
      oldClass = 'removed';
    }
    return (
      <div className={this.props.containerClass}>
        <span className={oldClass}>{this.props.fromObj}</span>
        {!strikeRemoved || ((!_.isEmpty(this.props.toObj) && !_.isEmpty(this.props.fromObj))) ? <span className="change-direction icon icon--arrows-linear-big-2-01" /> : null}
        <span>{this.props.toObj}</span>
      </div>
    );
  }

});

export default ChangeDirection;
