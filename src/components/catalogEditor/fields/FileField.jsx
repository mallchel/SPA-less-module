import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import trs from '../../../getTranslations';
import editorActions from '../../../actions/editorActions';

const FileField = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    field: React.PropTypes.object.isRequired,
    fieldIndex: React.PropTypes.number.isRequired,
    sectionId: React.PropTypes.string.isRequired,
    disabled: React.PropTypes.bool
  },
  getInitialState: function() {
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
      <div className="field-type-file">
        <label className="checkbox">
          <input
              disabled={this.props.disabled}
              type="checkbox"
              checked={this.state.multiselect}
              onChange={this.onChangeMultiselect} />
          <span>{trs('fieldTypes.file.canSelectMultiple')}</span>
        </label>
      </div>
    );
  }

});

export default FileField;
