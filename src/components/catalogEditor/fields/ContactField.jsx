import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import trs from '../../../getTranslations';
import Dropdown from '../../common/Dropdown';
import editorActions from '../../../actions/editorActions';
import {EMAIL, PHONE, SITE} from '../../../configs/contactFieldSubTypes';
import {CONTACT} from '../../../configs/fieldTypes';

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
      items: fieldTypes.map((type)=> {
        return {
          key: type,
          text: trs(`fieldTypes.${this.props.field.get('type')}.types.` + type)
        };
      })
    };
  },

  onSelect(items) {
    editorActions.changeFieldConfig(this.props.sectionId, this.props.fieldIndex, {
      type: items[0] && items[0].key
    });
  },

  render() {
    return (
      <div className="field-type-text">
        <Dropdown
          disabled={this.props.disabled}
          items={this.state.items}
          value={this.props.field.getIn(['config', 'type'])}
          withButton={true}
          onSelectItems={this.onSelect} />
      </div>
    );
  }

});

export default TextField;
