import React from 'react'
import _ from 'lodash'
import Reflux from 'reflux'
import Immutable from 'immutable'
import PropTypes from 'prop-types'
import UserSettingsStore from '../../../../../../../../../stores/UserSettingsStore'
import recordActions from '../../../../../../../../../actions/recordActions'
import RecordsData from './RecordsBody/RecordsData'

import FIELD_TYPES from '../../../../../../../../../configs/fieldTypes'

function getDropdownItemsById(map, fields) {
  fields.forEach((field) => {
    let type = field.get('type');
    if (type === FIELD_TYPES.DROPDOWN || type === FIELD_TYPES.RADIOBUTTON || type === FIELD_TYPES.CHECKBOXES) {
      field.getIn(['config', 'items']).forEach((item) => map = map.set(field.get('id') + ':' + item.get('id'), item));
    }
  });
  return map;
}

const Records = React.createClass({
  mixins: [Reflux.listenTo(UserSettingsStore, "onUserSettings")],
  propTypes: {
    catalog: PropTypes.object,
    viewId: PropTypes.string
  },

  // refactor
  onUserSettings(store, state) {
    // update user settings visible for FieldConfigItem.
    this.setState({ userSettingsState: state });
  },

  startInitialCatalogLoadingTimer() {
    this.showTimer = setTimeout(() => {
      this.setState({
        dataVisible: true
      });
    }, 300);
  },

  componentDidMount() {
    const viewId = this.props.viewId;
    recordActions.requestForRecords(this.catalogId(), { viewId });
  },

  catalogId(catalog = this.props.catalog) {
    return catalog.get('id');
  },

  componentWillReceiveProps(nextProps) {
    // this.startInitialCatalogLoadingTimer();
    const viewId = this.props.viewId;
    const newViewId = nextProps.viewId;
    const catalogId = this.catalogId();
    const newCatalogId = nextProps.catalog.get('id');
    const filters = this.props.catalog.getIn(['views', viewId, 'filters']);
    const newFilters = nextProps.catalog.getIn(['views', newViewId, 'filters']);

    if ((newViewId !== viewId) || newCatalogId !== catalogId || !_.isEqual(newFilters, filters)) {
      recordActions.requestForRecords(newCatalogId, { viewId: newViewId });
    }
  },

  render() {
    const catalog = this.props.catalog;
    let dropdownItemsById;
    const records = catalog.get('records');
    const catalogId = catalog.get('id');

    // set ordering by default.
    const fieldsOrderUSettings = UserSettingsStore.getFieldsOrder({ catalogId }, []);

    let fields = catalog.get('fields');
    let fieldsToRender = new Immutable.List();

    if (fields) {
      fields.map(field => {
        // get index from collection
        let index = fieldsOrderUSettings.indexOf(field.get('id'));
        field = field.set('_order', (index != -1) ? index : 9999);
        return field;
      });

      // apply orderFields from user settings.
      fields = fields.sort((f1, f2) => f1.get('_order') - f2.get('_order'));

      fields.forEach(field => {
        const type = field.get('type');
        const colId = field.get('id');
        const visible = UserSettingsStore.getVisibilityField({
          fieldId: colId,
          catalogId: catalogId
        }, true);

        if (!visible || type === FIELD_TYPES.GROUP) {
          return;
        }

        fieldsToRender = fieldsToRender.push(field);
      })

      let itemsMap = new Immutable.Map({});
      dropdownItemsById = getDropdownItemsById(itemsMap, fieldsToRender);
    }

    // get sort info from user settings.
    // let sortingRecordSetting = UserSettingsStore.getSortingRecords({ catalogId });
    return (
      fieldsToRender && records
        ?
        <RecordsData
          fields={fieldsToRender}
          records={records}
          dropdownItemsById={dropdownItemsById}
        />
        :
        null
    );
  }

});

export default Records;
