import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import TextInput from './common/TextInput'

import Hint from '../hint'

import recordActions from '../../../../../../../../../../actions/recordActions'

const TextField = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    value: React.PropTypes.string,
    config: React.PropTypes.object,
    onSave: React.PropTypes.func.isRequired,
    onUpdate: React.PropTypes.func.isRequired,
    disableDebounce: React.PropTypes.bool,
    readOnly: React.PropTypes.bool,
    required: React.PropTypes.bool,
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

  onSave(value) {
    this.props.onSave(value);
    this.setState({ value });
  },

  onBlur(e) {
    let val = e.target.value;
    if (val) {
      recordActions.clearErrorField(this.props.catalogId, this.props.recordId, this.props.fieldId);
    }
  },

  render() {
    const { config, field, onUpdate, updateProcess } = this.props;
    const isMultiLine = config.get('type') === 'multiline';

    return (
      <div className="record-text">
        <TextInput
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
        />

        <Hint className={this.state.value ? 'hide' : ''} text={this.props.hint} readOnly={this.props.readOnly} />
      </div>
    );
  }
});

export default TextField;
