import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import trs from '../../../getTranslations';
import Dropdown from '../../common/Dropdown';
import editorActions from '../../../actions/editorActions';

const fieldTypes = ['text', 'tel', 'mail', 'multiline'];

const TextField = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    field: React.PropTypes.object.isRequired,
    fieldIndex: React.PropTypes.number.isRequired,
    sectionId: React.PropTypes.string.isRequired,
    disabled: React.PropTypes.bool
  },

  getInitialState() {
    return {
      initialValue: this.getValue()
    };
  },

  getValue() {
    return this.props.field.getIn(['config', 'type']);
  },

  onSelect(e) {
    let value = e.target.checked;

    editorActions.changeFieldConfig(this.props.sectionId, this.props.fieldIndex, {
      type: value ? 'multiline' : 'text'
    });
  },

  render() {
    let isMultiLine= this.getValue() === 'multiline';

    return (
      <div className="field-type-text">
        <label className="checkbox">
          <input type="checkbox" checked={isMultiLine} onChange={this.onSelect}/>
          {trs('fieldTypes.text.types.multiline')}
        </label>
      </div>
    );
  }

});

export default TextField;
