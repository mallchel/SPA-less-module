import FIELD_TYPES from '../../../../../../../../configs/fieldTypes'

const filterComponentsByFieldType = {
  [FIELD_TYPES.NUMBER]: require('./fields/NumberField').default,
  [FIELD_TYPES.CONTACT]: require('./fields/ContactField').default,
  [FIELD_TYPES.DATE]: require('./fields/DateField').default,
  [FIELD_TYPES.USER]: require('./fields/UserField').default,
  [FIELD_TYPES.DROPDOWN]: require('./fields/DropdownField').default,
  [FIELD_TYPES.CHECKBOXES]: require('./fields/CheckboxesField').default,
  [FIELD_TYPES.RADIOBUTTON]: require('./fields/CheckboxesField').default,
  [FIELD_TYPES.OBJECT]: require('./fields/ObjectField').default,
  [FIELD_TYPES.PROGRESS]: require('./fields/ProgressField').default,
  [FIELD_TYPES.STARS]: require('./fields/StarsField').default
};

export default function (type) {
  return filterComponentsByFieldType[type];
}
