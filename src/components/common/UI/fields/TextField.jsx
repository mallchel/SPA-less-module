import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import PropTypes from 'prop-types'
import TextInput from './common/TextInput'
// import { Input } from 'antd'

import Hint from '../hint'

// import recordActions from '../../../../actions/recordActions'

const TextField = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    value: PropTypes.string,
    controlConfig: PropTypes.object,
    hint: PropTypes.string,
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
    const { onUpdate, updateProcess, hint, readOnly, config, value, htmlId } = this.props;
    const isMultiLine = config.get('type') === 'multiline';

    return (
      <div className="record-text">
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
        {
          hint && <Hint text={hint} readOnly={readOnly} />
        }
      </div>
    );
  }
});

export default TextField;
