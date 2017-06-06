import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDataGrid, { Row } from 'react-data-grid'
import Immutable from 'immutable'
import FIELD_TYPES from '../../../../../../../../../../configs/fieldTypes'
// import NavRedirect from '../../../../../../../../../common/router/Redirect'
import NavLink from '../../../../../../../../../common/router/Link'
import routes from '../../../../../../../../../../routes'
import appState from '../../../../../../../../../../appState'

const fieldComponentsByType = {
  [FIELD_TYPES.TEXT]: require('../../../../../../../../../common/dataTypes/TextField').default,
  [FIELD_TYPES.NUMBER]: require('./fieldWrappers/NumberField').default,
  [FIELD_TYPES.CONTACT]: require('../../../../../../../../../common/dataTypes/ContactField').default,
  [FIELD_TYPES.DATE]: require('../../../../../../../../../common/dataTypes/DateField').default,
  [FIELD_TYPES.USER]: require('../../../../../../../../../common/dataTypes/UserField').default,
  [FIELD_TYPES.DROPDOWN]: require('../../../../../../../../../common/dataTypes/DropdownField').default,
  [FIELD_TYPES.CHECKBOXES]: require('../../../../../../../../../common/dataTypes/DropdownField').default,
  [FIELD_TYPES.RADIOBUTTON]: require('../../../../../../../../../common/dataTypes/DropdownField').default,
  [FIELD_TYPES.OBJECT]: require('../../../../../../../../../common/dataTypes/ObjectField').default,
  [FIELD_TYPES.FILE]: require('./fieldWrappers/FileField').default,
  [FIELD_TYPES.PROGRESS]: require('../../../../../../../../../common/dataTypes/ProgressField').default,
  [FIELD_TYPES.STARS]: require('../../../../../../../../../common/dataTypes/StarsField').default
};

class RowRenderer extends Row {
  render() {
    return (
      <NavLink route={routes.record} params={{ recordId: this.props.row.id }} render={({ link, history }) => {
        return (
          <div onClick={e => history.push(link)}>
            {super.render()}
          </div>
        )
      }} />
    )
  }
}

class RecordsData extends Component {
  static propTypes = {
    fields: PropTypes.array,
    records: PropTypes.array
  }

  render() {
    const values = this.props.records.toArray().map((record, i) => {
      let values = record.get('values');
      let valuesComponents = {
        id: record.get('id'),
      };
      this.props.fields.forEach((field) => {
        const type = field.get('type');
        const fieldId = field.get('id');

        const FieldComponent = fieldComponentsByType[type];
        if (!FieldComponent) {
          return;
        }

        let value = values.get(fieldId);
        let props = {
          fieldId,
          value,
          config: field.get('config'),
          fieldType: type
        };

        if (type === FIELD_TYPES.DROPDOWN || type === FIELD_TYPES.RADIOBUTTON || type === FIELD_TYPES.CHECKBOXES) {
          props.dropdownItemsById = this.props.dropdownItemsById;
          props.inContainers = type === FIELD_TYPES.DROPDOWN;
        }

        valuesComponents[fieldId] = <FieldComponent {...props} />

      });
      return valuesComponents;
    });

    const columns = this.props.fields.toJS().map(field => {
      return {
        key: field.id,
        name: field.name
      }
    });

    return (
      <div>
        {
          (values && columns)
            ?
            <ReactDataGrid
              columns={columns}
              rowGetter={i => values[i]}
              rowsCount={values.length}
              minWidth={0}
              //rowRenderer={<RowRenderer {...this.props} cellRenderer={CellRenderer} />}
              rowRenderer={RowRenderer}
            />
            :
            null
        }
        {/*onRowClick={this.onRowClick}*/}
      </div>
    )
  }
}

export default RecordsData;
