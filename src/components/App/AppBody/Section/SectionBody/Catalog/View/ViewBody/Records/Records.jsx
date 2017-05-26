import React from 'react'
import _ from 'lodash'
import Reflux from 'reflux'
import ReactDataGrid from 'react-data-grid'
import UserSettingsStore from '../../../../../../../../../stores/UserSettingsStore'
import recordActions from '../../../../../../../../../actions/recordActions'

const Records = React.createClass({
  mixins: [Reflux.listenTo(UserSettingsStore, "onUserSettings")],
  propTypes: {
    catalog: React.PropTypes.object,
  },

  getInitialState() {
    this.createRows();
    return null;
  },

  createRows() {
    let rows = [];
    for (let i = 1; i < 10; i++) {
      rows.push({
        id: i,
        title: 'Title ' + i,
        count: i
      });
    }

    this._rows = rows;
  },

  rowGetter(i) {
    console.log(this._records[i], i)
    // return this._rows[i];
    return this._records[i];
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
    recordActions.requestForRecords(this.catalogId()); // todo +viewId.
  },

  catalogId(catalog = this.props.catalog) {
    return catalog && catalog.get('id');
  },

  componentWillReceiveProps(nextProps) {
    // this.startInitialCatalogLoadingTimer();
  },

  render() {
    const catalog = this.props.catalog;
    this._fieldsToRender = [];
    if (catalog) {
      const fields = catalog.get('fields');
      const catalogId = catalog.get('id');
      this._columns = fields && fields.toJS().map(field => {
        return {
          key: field.id,
          name: field.name
        }
      });
      this._records = catalog.get('records') && catalog.get('records').toJS().map(record => {
        return record.values;
      })
      // get sort info from user settings.
      let sortingRecordSetting = UserSettingsStore.getSortingRecords({ catalogId });
    }
    return (
      // console.log(this._columns, this._rows),
      this._columns && this._records ?
        <ReactDataGrid
          columns={this._columns}
          rowGetter={this.rowGetter}
          rowsCount={this._records.length}
          minHeight={500}
        />
        :
        null
    );
  }

});

export default Records;
