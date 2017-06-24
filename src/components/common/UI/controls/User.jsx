import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import PropTypes from 'prop-types'
import RecordDropdown from './RecordDropdown.jsx'

const User = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    value: PropTypes.object,
    config: PropTypes.object,
    onSave: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired
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

  onSave(data) {
    this.props.onSave(data);
    this.props.onUpdate(data);
  },

  render() {
    return (
      <RecordDropdown {...this.props}
        remoteGroup="users"
        inMapper={this.inMapper}
        outMapper={this.outMapper}
        itemsMapper={this.inMapper}
        onSave={e => this.onSave(e)} />
    );
  }
});

export default User;
