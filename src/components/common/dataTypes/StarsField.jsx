import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

const StarsField = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    value: React.PropTypes.number.isRequired,
    config: React.PropTypes.object
  },

  render() {
    return (
      <span className={'stars-field stars-field--' + this.props.value}>
        <span className="icon icon--vote-38" />
        <span className="icon icon--vote-38" />
        <span className="icon icon--vote-38" />
        <span className="icon icon--vote-38" />
        <span className="icon icon--vote-38" />
      </span>
    );
  }
});

export default StarsField;
