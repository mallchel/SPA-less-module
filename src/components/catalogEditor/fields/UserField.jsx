import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import trs from '../../../getTranslations'
import editorActions from '../../../actions/editorActions'
import { Checkbox } from 'antd'

const UserField = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    field: React.PropTypes.object.isRequired,
    fieldIndex: React.PropTypes.number.isRequired,
    sectionId: React.PropTypes.string.isRequired,
    disabled: React.PropTypes.bool
  },
  getInitialState: function () {
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
        <Checkbox
          disabled={this.props.disabled}
          checked={this.state.multiselect}
          onChange={this.onChangeMultiselect}
          style={{ display: 'block' }}
        >
          {trs('fieldTypes.user.canSelectMultiple')}
        </Checkbox>
        <Checkbox
          disabled={this.props.disabled}
          checked={this.state.defaultValue}
          onChange={this.onChangeDefaultValue}
          style={{ display: 'block' }}
        >
          {trs('fieldTypes.user.default')}
        </Checkbox>
      </div>
    );
  }

});

export default UserField;
