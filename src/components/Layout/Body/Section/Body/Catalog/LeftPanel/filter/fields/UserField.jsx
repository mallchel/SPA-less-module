import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import RecordDropdown from './RecordDropdown.jsx'
import AppState from '../../../../../../../../../appState'


const UserField = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    value: React.PropTypes.object,
    config: React.PropTypes.object,
    onSave: React.PropTypes.func
  },

  inMapper(v) {
    return {
      key: v.id,
      text: v.title,
      icon: 'users-1'
    };
  },

  outMapper(item) {
    return {
      id: item.key,
      title: item.text
    };
  },

  filterMapper(item) {
    return item.key
  },

  render() {
    // @override this.props.multiselect
    let config = this.props.config.set('multiselect', true);
    let additionalItems = [];

    if (AppState.get('filterKeys').size) {
      let filterKeys = AppState.getIn(['filterKeys', 'users']).toJS();
      filterKeys.forEach(f => {
        additionalItems.push({
          id: f.key,
          title: f.value
        })
      });
    }

    return (
      <RecordDropdown
        additionalItems={additionalItems}
        remoteGroup="users"
        inMapper={this.inMapper}
        outMapper={this.outMapper}
        itemsMapper={this.inMapper}
        filterMapper={this.filterMapper}
        {...this.props}
        config={config}/>
    );
  }
});

export default UserField;
