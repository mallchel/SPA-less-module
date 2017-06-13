import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import trs from '../../../getTranslations'
import editorActions from '../../../actions/editorActions'
import { Checkbox } from 'antd'

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
    let isMultiLine = this.getValue() === 'multiline';

    return (
      <div>
        <Checkbox
          checked={isMultiLine}
          onChange={this.onSelect}
          style={{ display: 'block' }}
        >
          {trs('fieldTypes.text.types.multiline')}
        </Checkbox>
      </div>
    );
  }

});

export default TextField;
