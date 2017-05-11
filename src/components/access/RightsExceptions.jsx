import React from 'react';
import _ from 'lodash'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import trs from '../../getTranslations';
import PRIVILEGE_CODES from '../../configs/privilegeCodes';
import appState from '../../appState'

const RightsExceptions = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    exceptions: React.PropTypes.object.isRequired,
    basePrivilege: React.PropTypes.string.isRequired
  },

  getInitialState() {
    return {
      exceptions: this.props.exceptions || {},
      basePrivilege: this.props.basePrivilege || ''
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      exceptions: nextProps.exceptions || {},
      basePrivilege: nextProps.basePrivilege || ''
    });
  },

  render() {
    let exceptions = {}, exceptionsList = [];
    let exceptionPrivilege = this.props.basePrivilege=='edit'?'view':'edit';
    let fieldNames = appState.getIn(['currentCatalog', 'fields']);
    _.forEach(this.state.exceptions.toJS(), (privilege, fieldId) => {
      let fieldName = '';
      fieldNames.forEach((field) => {
        if (field.get('id') == fieldId) {
          fieldName = field.get('name');
        }
      });
      if (!exceptions[privilege]) {
        exceptions[privilege] = [];
      }
      exceptions[privilege].push(fieldName);
    });
    if (exceptions[exceptionPrivilege]) {
      exceptionsList.push(trs('modals.access.exception.' + exceptionPrivilege) + ': ');
      exceptionsList.push(exceptions[exceptionPrivilege].join(', '));
      return (
        <small>
          {exceptionsList}
        </small>
      );
    }

    return null;
  }

});

export default RightsExceptions;
