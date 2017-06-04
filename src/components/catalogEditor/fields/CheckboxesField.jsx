import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import trs from '../../../getTranslations';
import ItemListEditor from './ItemListEditor';
import editorActions from '../../../actions/editorActions';

const CheckboxesField = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    field: React.PropTypes.object.isRequired,
    fieldIndex: React.PropTypes.number.isRequired,
    catalogId: React.PropTypes.string,
    sectionId: React.PropTypes.string,
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
      <div className="field-type-checkboxes">
        <ItemListEditor
            disabled={this.props.disabled}
            fieldIndex={this.props.fieldIndex}
            sectionId={this.props.sectionId}
            catalogId={this.props.catalogId}
            field={this.props.field} />
        <label className="checkbox">
          <input disabled={this.props.disabled} type="checkbox" checked={this.state.defaultValue} onChange={this.onChangeDefaultValue} />
          <span>{trs('fieldTypes.checkboxes.default')}</span>
        </label>
      </div>
    );
  }

});

export default CheckboxesField;
