import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import trs from '../../../getTranslations';
import editorActions from '../../../actions/editorActions';

const UserField = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    field: React.PropTypes.object.isRequired,
    fieldIndex: React.PropTypes.number.isRequired,
    sectionId: React.PropTypes.string.isRequired,
    disabled: React.PropTypes.bool
  },
  getInitialState: function() {
    return {
      multiselect: !!this.props.field.getIn(['config', 'multiselect']),
      defaultValue: !!this.props.field.getIn(['config', 'defaultValue'])
    };
  },

  onChangeMultiselect(e) {
    let val = e.target.checked;
    this.setState({
      multiselect: val
    });
    editorActions.changeFieldConfig(this.props.sectionId, this.props.fieldIndex, {
      multiselect: val,
      defaultValue: this.state.defaultValue
    });
  },

  onChangeDefaultValue(e) {
    let defaultValue = e.target.checked;
    this.setState({
      defaultValue: defaultValue
    });
    editorActions.changeFieldConfig(this.props.sectionId, this.props.fieldIndex, {
      multiselect: this.state.multiselect,
      defaultValue: defaultValue
    });
  },


  render() {
    return (
      <div className="field-type-user">
        <label className="checkbox">
          <input disabled={this.props.disabled} type="checkbox" checked={this.state.multiselect} onChange={this.onChangeMultiselect} />
          <span>{trs('fieldTypes.user.canSelectMultiple')}</span>
        </label>
        <label className="checkbox">
          <input disabled={this.props.disabled} type="checkbox" checked={this.state.defaultValue} onChange={this.onChangeDefaultValue} />
          <span>{trs('fieldTypes.user.default')}</span>
        </label>
      </div>
    );
  }

});

export default UserField;
