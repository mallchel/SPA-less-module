import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Select } from 'antd'
import trs from '../../../getTranslations'
// import Dropdown from '../../common/Dropdown'
import editorActions from '../../../actions/editorActions'
import { EMAIL, PHONE, SITE } from '../../../configs/contactFieldSubTypes'

const Option = Select.Option;
const fieldTypes = [PHONE, EMAIL, SITE];

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
      items: fieldTypes.map((type) => {
        return {
          key: type,
          text: trs(`fieldTypes.${this.props.field.get('type')}.types.` + type)
        };
      })
    };
  },

  onSelect(itemKey) {
    editorActions.changeFieldConfig(this.props.sectionId, this.props.fieldIndex, {
      type: itemKey
    });
  },

  render() {
    return (
      <div>
        <Select
          style={{ width: '100%' }}
          children={this.state.items.map(item => <Option key={item.key}>{item.text}</Option>)}
          defaultValue={this.props.field.getIn(['config', 'type'])}
          onChange={this.onSelect}
        />
      </div>
    );
  }

});

export default TextField;
