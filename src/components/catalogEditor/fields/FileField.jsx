import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Checkbox } from 'antd'
import trs from '../../../getTranslations'
import editorActions from '../../../actions/editorActions'

const FileField = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    field: React.PropTypes.object.isRequired,
    fieldIndex: React.PropTypes.number.isRequired,
    sectionId: React.PropTypes.string.isRequired,
    disabled: React.PropTypes.bool
  },
  getInitialState: function () {
    return {
      multiselect: !!this.props.field.getIn(['config', 'multiselect'])
    };
  },

  onChangeMultiselect(e) {
    var val = e.target.checked;
    this.setState({
      multiselect: val
    });
    editorActions.changeFieldConfig(this.props.sectionId, this.props.fieldIndex, {
      multiselect: val
    });
  },

  render() {
    return (
      <div>
        <Checkbox
          disabled={this.props.disabled}
          name="multiselect"
          checked={this.state.multiselect}
          onChange={this.onChangeMultiselect}
        >
          {trs('fieldTypes.file.canSelectMultiple')}
        </Checkbox>
      </div>
    );
  }

});

export default FileField;
