import React from 'react'

import DropdownRemote from '../common/DropdownRemote'
import historyActions from '../../actions/historyActions'
import trs from '../../getTranslations'
import { connect } from '../StateProvider'

const PropTypes = React.PropTypes;

const HistoryUserFilter = React.createClass({
  propTypes: {
    catalogId: PropTypes.string.isRequired,
    recordId: PropTypes.string
  },
  getInitialState() {
    return {
      selectedUser: null,
      text: '',
    };
  },
  userInMapper(v) {
    return {
      key: v.id,
      text: v.title,
      icon: 'users-1',
      alwaysVisible: v.alwaysVisible,
      sort: ~~v.sort
    };
  },
  userOutMapper(v) {
    return {
      id: v.key,
      title: v.text,
      alwaysVisible: v.alwaysVisible,
      sort: ~~v.sort
    };
  },
  onSelectUser(item) {
    item = item[0];
    if (!item) {
      return;
    }
    const catalogId = this.props.catalogId;
    const recordId = this.props.recordId;
    if (item.id == 'all') {
      historyActions.setFilter({}, { catalogId, recordId });
    } else {
      historyActions.setFilter({ userId: item.id }, { catalogId, recordId });
    }
  },

  componentWillReceiveProps(nextProps) {
    let object = this.props.catalogs.getIn([this.props.catalogId, 'history']);
    if (nextProps.recordId) {
      object = this.props.records.getIn([nextProps.catalogId, nextProps.recordId]);
    }
    if (object) {
      let filter = object.get('filter') || { userId: null };
      this.setState({
        selectedUser: filter.userId || 'all'
      })
    }
  },
  render() {
    return (
      <DropdownRemote
        type="users"
        sortBy={false}
        multiselect={false}
        autocomplete={true}
        searchable={true}
        blockForceUpdateForEmpty={true}
        onSelectItems={this.onSelectUser}
        clearOnSelect={false}
        outMapper={this.userOutMapper}
        inMapper={this.userInMapper}
        itemsMapper={this.userInMapper}
        withButton={true}
        additionalItems={[{
          id: 'all', title: trs('catalogData.history.allEmployers'), alwaysVisible: true, sort: -1
        }]}
        sortBy="sort"
        placeholder={trs('catalogData.history.allEmployers')}
        value={this.state.selectedUser}
      />
    );
  }

});

export default connect(HistoryUserFilter, ['catalogs', 'records']);
