import _ from 'lodash'
import * as VALUE_TYPES from '../../../../../../../configs/reports/widget/valuesTypes'
import * as VALUE_SUB_TYPES from '../../../../../../../configs/reports/widget/valuesSubTypes'
import FIELD_TYPES from '../../../../../../../configs/fieldTypes'

import trs from '../../../../../../../getTranslations'

import BasicSelect from './Basic';

class SelectValue extends BasicSelect {
  getAvailableValues(fields) {
    const availableValues = [];

    availableValues.push({
      type: VALUE_TYPES.RECORDS_COUNT,
      title: trs('reports.widget.modals.common.tabs.data.value.types.recordsCount'),
      value: null
    });

    availableValues.push(..._.compact(_.flatten(fields.toArray().map(field => {
      switch (field.get('type')) {
        case FIELD_TYPES.NUMBER:
        case FIELD_TYPES.PROGRESS:
        case FIELD_TYPES.STARS:
          return {
            type: VALUE_TYPES.FIELD,
            title: field.get('name'),
            value: field.get('id')
          };
        case FIELD_TYPES.DROPDOWN:
        case FIELD_TYPES.CHECKBOXES:
        case FIELD_TYPES.RADIOBUTTON:
          return [
            {
              type: VALUE_TYPES.FIELD,
              subType: VALUE_SUB_TYPES.TIME_LEFT,
              title: field.get('name') + ` (${trs('reports.widget.modals.common.tabs.data.value.types.timeLeft')})`,
              value: field.get('id')
            },
            // temporary not supported
            // {
            //   type: VALUE_TYPES.FIELD,
            //   subType: VALUE_SUB_TYPES.TIME_BEFORE,
            //   title: field.get('name') + ` (${trs('reports.widget.modals.common.tabs.data.value.types.timeBefore')})`,
            //   value: field.get('id')
            // }
          ];
      }
    }))));

    return availableValues;
  }

  getDefaultValue() {
    return this.state.availableValues[0];
  }
}

export default SelectValue;
