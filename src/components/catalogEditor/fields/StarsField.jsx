import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

const StarsField = React.createClass({
  mixins: [PureRenderMixin],
  render() {
    return (
      <div className="field-type-stars">
        <div className="icon icon--vote-38" />
        <div className="icon icon--vote-38" />
        <div className="icon icon--vote-38" />
        <div className="icon icon--vote-38" />
        <div className="icon icon--vote-38" />
      </div>
    );
  }

});

export default StarsField;
