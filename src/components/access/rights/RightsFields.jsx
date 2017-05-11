import React from 'react';
import Immutable from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import trs from '../../../getTranslations';
import apiActions from '../../../actions/apiActions';
import filterActions from '../../../actions/filterActions';
import Section from './Section';
import FIELD_TYPES from '../../../configs/fieldTypes';

import _ from 'lodash';

const log = require('debug')('CRM:Component:Rights:Fields');

const RightsFields = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    appState: React.PropTypes.object.isRequired
  },
  getInitialState() {
    return {
      values : {}
    };
  },

  componentDidMount() {
    this.setState({
      values: this.props.values
    });
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.values) {
      this.setState({
        values: nextProps.values
      });
    }
  },


  render() {
    let sections = [];
    let _curGroup;
    let fields = this.props.fields;
    if (fields) {
      fields.forEach((field)=> {
        if (field.get('type') === FIELD_TYPES.GROUP) {
          _curGroup = {
            id: field.get('id'),
            section: field,
            fields: [],
          };
          sections.push(_curGroup);
        } else {
          if (!_curGroup) {
            _curGroup = {
              id: '',
              section: Immutable.fromJS({name: '', type: FIELD_TYPES.GROUP}),
              fields: [],
            };
            sections.push(_curGroup);
          }
          _curGroup.fields.push(field);
        }
      });
    }

    let sectionsComponents = sections.map((sec)=> {
      return <Section
        key={sec.id}
        catalogId={this.props.catalogId}
        section={sec.section}
        fields={sec.fields}
        values={this.state.values}
        readOnly={this.props.readOnly}
        appState={this.props.appState}
        onSaveField={this.props.onSaveField}
        basePrivilege={this.props.basePrivilege}
      />
    });
    return (
      <div className={'rights-fields'}>
        {sectionsComponents}
      </div>
    );
  }
});

export default RightsFields;
