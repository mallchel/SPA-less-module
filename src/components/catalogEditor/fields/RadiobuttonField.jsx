import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import trs from '../../../getTranslations';
import ItemListEditor from './ItemListEditor';
import editorActions from '../../../actions/editorActions';

const RadiobuttonField = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    field: React.PropTypes.object.isRequired,
    fieldIndex: React.PropTypes.number.isRequired,
    sectionId: React.PropTypes.string.isRequired,
    disabled: React.PropTypes.bool
  },

  getInitialState: function() {
    return {
      defaultValue: !!this.props.field.getIn(['config', 'defaultValue']),
    };
  },

  onChangeDefaultValue(e) {
    let defaultValue = e.target.checked;
    this.setState({
      defaultValue: defaultValue
    });
    editorActions.changeFieldConfig(this.props.sectionId, this.props.fieldIndex, {
      defaultValue: defaultValue
    });
  },

  render() {
    return (
      <div className="field-type-radiobutton">
        <ItemListEditor fieldIndex={this.props.fieldIndex} disabled={this.props.disabled} sectionId={this.props.sectionId} field={this.props.field} />
        <label className="checkbox">
          <input disabled={this.props.disabled} type="checkbox" checked={this.state.defaultValue} onChange={this.onChangeDefaultValue} />
          <span>{trs('fieldTypes.radiobutton.default')}</span>
        </label>
      </div>
    );
  }

});

export default RadiobuttonField;
