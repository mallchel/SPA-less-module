import FIELD_TYPES from '../configs/fieldTypes';

export default function getRecordHeaderText(record) {
  let headerText = '';
  let firstTextField = record && record.get('fields') && record.get('fields').find((f)=> f.get('type') === FIELD_TYPES.TEXT);
  if ( firstTextField ) {
    headerText = record.getIn(['values', firstTextField.get('id')]) || '';
  }
  return headerText;
};
