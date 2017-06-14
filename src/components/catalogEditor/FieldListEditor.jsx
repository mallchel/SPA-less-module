import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import _ from 'lodash'

import dndContext from '../../services/dndContext'
import dndTargets from '../../configs/dndTargets'
import FieldDropArea from './FieldDropArea'
import FieldWrapper from './FieldWrapper'
import FIELD_TYPES from '../../configs/fieldTypes'

const Fields = {
  [FIELD_TYPES.GROUP]: require('./fields/SectionField').default,
  [FIELD_TYPES.TEXT]: require('./fields/TextField').default,
  [FIELD_TYPES.CONTACT]: require('./fields/ContactField').default,
  [FIELD_TYPES.NUMBER]: require('./fields/NumberField').default,
  [FIELD_TYPES.DATE]: require('./fields/DateField').default,
  [FIELD_TYPES.DROPDOWN]: require('./fields/DropdownField').default,
  [FIELD_TYPES.CHECKBOXES]: require('./fields/CheckboxesField').default,
  [FIELD_TYPES.RADIOBUTTON]: require('./fields/RadiobuttonField').default,
  [FIELD_TYPES.PROGRESS]: require('./fields/ProgressField').default,
  [FIELD_TYPES.STARS]: require('./fields/StarsField').default,
  [FIELD_TYPES.USER]: require('./fields/UserField').default,
  [FIELD_TYPES.OBJECT]: require('./fields/ObjectField').default,
  [FIELD_TYPES.FILE]: require('./fields/FileField').default
};

const FieldListEditor = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    dropType: React.PropTypes.string,
    dropInfo: React.PropTypes.object,
    catalog: React.PropTypes.object.isRequired,
    catalogs: React.PropTypes.object.isRequired,
    sectionId: React.PropTypes.string.isRequired,
    disabled: React.PropTypes.bool
  },

  getInitialState() {
    return {};
  },

  componentWillReceiveProps(nextProps) {
    // compare prev and next props,
    // find new field from list. (index)
    let diffField = _.difference(
      nextProps.catalog.get('fields').toJS().map(f => f.uuid),
      this.props.catalog.get('fields').toJS().map(f => f.uuid)
    )[0];
    if (diffField) {
      this.setState({
        diffFieldUuid: diffField
      });
    }
  },

  resetDiffAfterFocusInputNameInWrapper(/*field*/) {
    this.setState({ diffFieldUuid: undefined });
  },

  render() {

    let fields = this.props.catalog.get('fields').toArray();
    let originalFields = this.props.catalog.get('originalFields');
    let fieldsLen = fields.length;
    let fieldNames = fields.map(c => {
      return { id: c.get('id'), name: c.get('name'), type: c.get('type') };
    });
    let fieldComponents = [];
    let disableDropAreasAroundId = this.props.dropType === dndTargets.FIELD && this.props.dropInfo.get('fieldId');

    fields.forEach((field, i) => {
      let fieldId = field.get('id');
      let originalField = fieldId ? originalFields.find(f => f.get('id') === fieldId) : null;

      let FieldComponent = Fields[field.get('type')];
      // Disable drop areas around current dragging field
      let disableDropArea = (disableDropAreasAroundId && (field.get('id') === disableDropAreasAroundId ||
        (i < fieldsLen - 1 && fields[i + 1].get('id') === disableDropAreasAroundId)));

      if (i === 0) {
        fieldComponents.push(
          <FieldDropArea key={'drop'} disabled={disableDropArea} prevFieldIndex={-1} sectionId={this.props.sectionId}/>
        );
      }

      fieldComponents.push(
        <FieldWrapper draggableDisabled={i === 0}
          needFocusOnInputNameCallback={this.state.diffFieldUuid == field.get('uuid') ?
            this.resetDiffAfterFocusInputNameInWrapper.bind(this, field) : null}
          hideCross={i === 0}
          disabled={this.props.disabled}
          key={field.get('uuid')}
          fieldIndex={i}
          sectionId={this.props.sectionId}
          field={field}
          fields={fields}
          catalogId={this.props.catalog.get('id')}>

          <FieldComponent
            disabled={this.props.disabled}
            sectionId={this.props.sectionId}
            fieldIndex={i}
            field={field}
            originalField={originalField}
            fields={fields}
            catalogs={this.props.catalogs}
            catalogId={this.props.catalog.get('id')} />
        </FieldWrapper>
      );


      fieldComponents.push(
        <FieldDropArea key={i + 'drop'} disabled={disableDropArea} prevFieldIndex={i} sectionId={this.props.sectionId} />
      );
    });

    return (
      <div className="field-list">
        {fieldComponents}
      </div>
    );
  }

});

export default dndContext(FieldListEditor);

