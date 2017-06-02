import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import nl2br from '../../../utils/nl2br';

import TextField from '../../common/dataTypes/TextField';

const MultiLineTextField = ({value})=> {
  let text = nl2br(value);

  // WTF: {val || ' '} ??? - copied from TextField
  return (
    <span>{text || ' '}</span>
  );
};

const ChangeText = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    change: React.PropTypes.object.isRequired,
    config: React.PropTypes.object.isRequired,
    isNewRecord: React.PropTypes.bool
  },

  render() {
    let isMultiline = this.props.config.get('type') == 'multiline';
    let newValue = this.props.change.get('newValue');
    let oldValue = this.props.change.get('oldValue');
    if (isMultiline) {
      return (
        <div>
          <MultiLineTextField value={newValue} />
        </div>
      );
    } else {
      return (
        <div>
          <div className="removed"><TextField value={oldValue} /></div>
          <TextField value={newValue} />
        </div>
      );
    }
  }

});

export default ChangeText;
