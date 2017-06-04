import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

const ProgressField = React.createClass({
  mixins: [PureRenderMixin],
  render() {
    return (
      <div className="field-type-progress">
        <span>0 — 100%</span>
      </div>
    );
  }

});

export default ProgressField;
