import React from 'react'
import _ from 'lodash'
import Reflux from 'reflux'
import UserSettingsStore from '../../../../../../../../../stores/UserSettingsStore'
import recordActions from '../../../../../../../../../actions/recordActions'
import RecordsData from './RecordsData'

const Records = React.createClass({
  mixins: [Reflux.listenTo(UserSettingsStore, "onUserSettings")],
  propTypes: {
    catalog: React.PropTypes.object,
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
    this.fieldsToRender = [];

    if (catalog) {
      this.fields = catalog.get('fields');
      this.records = catalog.get('records');

      const catalogId = catalog.get('id');

      // get sort info from user settings.
      let sortingRecordSetting = UserSettingsStore.getSortingRecords({ catalogId });
    }
    return (
      this.fields && this.records
        ?
        <RecordsData
          fields={this.fields}
          records={this.records}
        />
        :
        null
    );
  }

});

export default Records;
