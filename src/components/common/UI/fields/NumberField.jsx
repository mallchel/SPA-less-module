import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import TextInput from './common/TextInput'

// import recordActions from '../../../../../../../../../../actions/recordActions'

import Hint from '../hint'

const NumberField = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    value: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string
    ]),
    config: React.PropTypes.object,
    onSave: React.PropTypes.func.isRequired,
    onUpdate: React.PropTypes.func.isRequired,
    disableDebounce: React.PropTypes.bool,
    readOnly: React.PropTypes.bool,
    error: React.PropTypes.string,
    catalogId: React.PropTypes.string,
    recordId: React.PropTypes.string,
    fieldId: React.PropTypes.string,
    field: React.PropTypes.object,
  },

  getInitialState() {
    return {
      value: this.props.value
    };
  },

  render() {
    const { updateProcess, value, readOnly, onUpdate, hint, htmlId } = this.props;
    const unit = this.props.config.get('unit');

    return (
      <span className="record-number">
        <TextInput
          id={htmlId}
          type="number"
          value={value}
          onSave={this.props.onSave}
          onUpdate={onUpdate}
          readOnly={readOnly}
          updateProcess={updateProcess}
        />
        {
          unit && <span>{unit}</span>
        }
        {
          hint && <Hint text={hint} readOnly={readOnly} />
        }
      </span>
    );
  }
});

export default NumberField;
