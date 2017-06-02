import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import TextInput from './common/TextInput'

import recordActions from '../../../../../../../../../../actions/recordActions'

import Hint from '../hint';

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

  onSave(value) {
    this.props.onSave(value || null);
    this.setState({ value });
  },

  onBlur(e) {
    let val = e.target.value;
    if (val) {
      recordActions.clearErrorField(this.props.catalogId, this.props.recordId, this.props.fieldId);
    }
  },

  render() {
    const { updateProcess } = this.props;
    const unit = this.props.config.get('unit');

    return (
      <span className="record-number">
        <TextInput
          type="number"
          disableDebounce={true}
          value={this.props.value}
          onSave={this.onSave}
          onBlur={this.onBlur}
          readOnly={this.props.readOnly}
          error={this.props.error}
          focus={this.props.focus || false}
          catalogId={this.props.catalogId}
          recordId={this.props.recordId}
          fieldId={this.props.fieldId}
          field={this.props.field}
          onUpdate={this.props.onUpdate}
          updateProcess={updateProcess}
        />
        {
          unit && (
            <span className="record-number__unit">{this.props.config.get('unit')}</span>
          )
        }

        <Hint className={this.state.value ? 'hide' : ''} text={this.props.hint} readOnly={this.props.readOnly} />
      </span>
    );
  }
});

export default NumberField;
