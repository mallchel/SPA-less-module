import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import PropTypes from 'prop-types'
import TextInput from './common/TextInput'
import { Input } from 'antd'

import Hint from '../hint'

import recordActions from '../../../../actions/recordActions'

const TextField = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    value: PropTypes.string,
    config: PropTypes.object,
    onSave: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    disableDebounce: PropTypes.bool,
    readOnly: PropTypes.bool,
    required: PropTypes.bool,
    error: PropTypes.string,
    catalogId: PropTypes.string,
    recordId: PropTypes.string,
    fieldId: PropTypes.string,
    field: PropTypes.object,
  },

  getInitialState() {
    return {
      value: this.props.value
    };
  },

  onSave(value) {
    this.props.onSave(value);
    this.setState({ value });
  },

  onBlur(e) {
    let val = e.target.value;
    if (val) {
      this.props.onBlur();
      //   recordActions.clearErrorField(this.props.catalogId, this.props.recordId, this.props.fieldId);
    }
  },

  render() {
    const { config, field, onUpdate, updateProcess } = this.props;
    const isMultiLine = config.get('type') === 'multiline';

    let props = {
      value: this.state.value,
      onBlur: this.onBlur,
      onChange: this.onSave,
      readOnly: this.props.readOnly
    };

    let wrapperClassName = 'textarea--wrapper ' + (this.props.wrapperClassName || '');
    if (props.style) {
      props.style.resize = 'none'
    }

    return (
      <div className="record-text">
        {/*<TextInput
          disableDebounce={true}
          value={this.props.value}
          onSave={this.onSave}
          onBlur={this.onBlur}
          multiline={isMultiLine}
          maxLength={isMultiLine ? null : 255}
          isRequired={this.props.required}
          readOnly={this.props.readOnly}
          error={this.props.error || null}
          field={field}
          onUpdate={onUpdate}
          updateProcess={updateProcess}

          catalogId={this.props.catalogId}
          recordId={this.props.recordId}
          fieldId={this.props.fieldId}
        />*/}

        {

          this.props.multiline ?
            (
              <div ref="textAreaWrapper" className={wrapperClassName}>
                <Input
                  ref="textArea"
                  type="textarea"
                  {...props}
                  autosize
                />
              </div>
            )
            :
            <Input ref="input" {...props} />
        }

        <Hint className={this.state.value ? 'hide' : ''} text={this.props.hint} readOnly={this.props.readOnly} />
      </div>
    );
  }
});

export default TextField;
