import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import PropTypes from 'prop-types'
import TextInput from './common/TextInput'

const TextControl = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    value: PropTypes.string,
    controlConfig: PropTypes.object,
    readOnly: PropTypes.bool,
    config: PropTypes.object,
    onSave: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    updateProcess: PropTypes.object,
    error: PropTypes.string,
  },

  onSave(value) {
    this.props.onSave(value);
  },

  render() {
    const { onUpdate, updateProcess, readOnly, config, value, htmlId } = this.props;
    const isMultiLine = config.get('type') === 'multiline';

    return (
      <TextInput
        id={htmlId}
        value={value}
        onSave={this.onSave}
        onUpdate={onUpdate}
        readOnly={readOnly}
        multiline={isMultiLine}
        updateProcess={updateProcess}
        minRows={isMultiLine && 2}
      />
    );
  }
});

export default TextControl;
