import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import trs from '../../../getTranslations';
import editorActions from '../../../actions/editorActions';

const NumberField = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    field: React.PropTypes.object.isRequired,
    fieldIndex: React.PropTypes.number.isRequired,
    sectionId: React.PropTypes.string.isRequired,
    disabled: React.PropTypes.bool
  },

  getInitialState() {
    return {
      value: this.props.field.getIn(['config', 'unit'])
    };
  },

  onChange(e) {
    var newVal = e.target.value || '';
    this.setState({
      value: newVal
    });
    editorActions.changeFieldConfig(this.props.sectionId, this.props.fieldIndex, {
      unit: newVal
    });
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.field.getIn(['config', 'unit'])
    });
  },

  render() {
    return (
      <div className="field-type-number">
        <input
            type="text"
            disabled={this.props.disabled}
            value={this.state.value}
            onChange={this.onChange}
            placeholder={trs('fieldTypes.number.placeholder')}/>
      </div>
    );
  }

});

export default NumberField;
