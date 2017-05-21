import FIELD_TYPES from '../../../../../../../../configs/fieldTypes'

const filterComponentsByFieldType = {
  [FIELD_TYPES.NUMBER]: require('./fields/NumberField'),
  [FIELD_TYPES.CONTACT]: require('./fields/ContactField'),
  [FIELD_TYPES.DATE]: require('./fields/DateField'),
  [FIELD_TYPES.USER]: require('./fields/UserField'),
  [FIELD_TYPES.DROPDOWN]: require('./fields/DropdownField'),
  [FIELD_TYPES.CHECKBOXES]: require('./fields/CheckboxesField'),
  [FIELD_TYPES.RADIOBUTTON]: require('./fields/CheckboxesField'),
  [FIELD_TYPES.OBJECT]: require('./fields/ObjectField'),
  [FIELD_TYPES.PROGRESS]: require('./fields/ProgressField'),
  [FIELD_TYPES.STARS]: require('./fields/StarsField')
};

export default function (type) {
  return filterComponentsByFieldType[type];
}
