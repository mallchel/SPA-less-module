import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import ImmutablePropTypes from 'react-immutable-proptypes'

import DebouncedInput from '../../../../../../../../common/DebouncedInput'

const log = require('debug')('CRM:Component:Filter:ContactField');

const ContactField = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    fieldId: React.PropTypes.string,
    value: React.PropTypes.string,
    config: ImmutablePropTypes.contains({
      type: React.PropTypes.string
    }).isRequired,
    onSave: React.PropTypes.func.isRequired
  },

  componentWillReceiveProps(nextProps) {

  },

  onSave(value) {
    //this.setState(value);
    log('filter value', value);
    this.props.onSave(this.props.fieldId, value);
  },

  render() {
    return (
      <div>
        <DebouncedInput
          value={this.props.value}
          className="w100"
          onSave={this.onSave}
        />
      </div>
    );
  }
});

export default ContactField;
