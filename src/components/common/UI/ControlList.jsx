import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Row } from 'antd'
import Immutable from 'immutable'
import { connect } from '../../StateProvider'
import FIELD_TYPES from '../../../configs/fieldTypes'
// import trs from '../../../getTranslations'
import ControlItem from './ControlItem'
import apiActions from '../../../actions/apiActions'
import recordActions from '../../../actions/recordActions'

import styles from './mainTab.less'

const fieldComponentsByType = {
  [FIELD_TYPES.TEXT]: require('./fields/TextField').default,
  // [FIELD_TYPES.CONTACT]: require('./fields/ContactField').default,
  // [FIELD_TYPES.NUMBER]: require('./fields/NumberField').default,
  // [FIELD_TYPES.DATE]: require('./fields/DateField').default,

  // [FIELD_TYPES.DROPDOWN]: require('./fields/DropdownField').default,
  // [FIELD_TYPES.CHECKBOXES]: require('./fields/CheckboxesField').default,
  // [FIELD_TYPES.RADIOBUTTON]: require('./fields/RadiobuttonField').default,

  // [FIELD_TYPES.PROGRESS]: require('./fields/ProgressField').default,
  // [FIELD_TYPES.STARS]: require('./fields/StarsField').default,

  // [FIELD_TYPES.OBJECT]: require('./fields/ObjectField').default,
  // [FIELD_TYPES.USER]: require('./fields/UserField').default,
  // [FIELD_TYPES.FILE]: require('./fields/FileField').default,
};

class ControlList extends Component {
  static propTypes = {
    record: PropTypes.object,
    recordId: PropTypes.string,
    catalogId: PropTypes.string,
    // section: PropTypes.object.isRequired,
    // fields: PropTypes.array.isRequired,
    // values: PropTypes.object.isRequired,
    // onSaveField: PropTypes.func.isRequired
  }

  state = {
    open: true,
    errors: []
  }

  updateErrorFields(event) {
    if (event.event == 'onErrors') {
      if (event.errors[this.props.catalogId]) {
        this.setState({ errors: event.errors[this.props.catalogId][this.props.recordId] });
      }
      let sectionHasErrors = false;
      this.props.fields.forEach((field) => {
        _.forEach(this.state.errors, (error) => {
          if (error.fieldId == field.get('id')) {
            sectionHasErrors = true;
          }
        });
      });
      if (sectionHasErrors) {
        this.setState({ open: true });
      }
    }
  }

  toggleList() {
    this.setState({
      open: !this.state.open
    });
  }

  onSaveField(fieldId, data) {
    this.props.onSaveField(fieldId, data);

    const field = this.props.fields.find(f => f.get('id') === fieldId);

    if (field.get('eventable')) {
      const { recordId, catalogId } = this.props;
      recordActions.shouldUpdateProcess(catalogId, recordId, fieldId);
    }
  }

  onUpdateField(field, data) {
    if (!field.get('eventable')) {
      return;
    }

    const { recordId, catalogId, record } = this.props;
    const realRecordId = record.get('isNew') ? null : recordId;
    const fieldId = field.get('id');

    const values = { [fieldId]: data };
    const allValues = Object.assign(record.get('values').toJS(), values);

    apiActions.createChange({
      catalogId,
      recordId: realRecordId || 'new'
    }, {
        values,
        allValues
      }, {
        recordId,
        fieldId
      });
  }

  render() {
    console.log(this.props.meta)
    let sections = [];
    let _curGroup;
    const { record } = this.props;
    const meta = this.props.meta;
    const values = this.props.data;

    if (meta.size !== 0) {
      meta.forEach((field) => {
        if (field.get('type') === FIELD_TYPES.GROUP) {
          _curGroup = {
            id: field.get('id'),
            section: field,
            fields: [],
            values: {}
          };
          sections.push(_curGroup);
        } else {
          if (!_curGroup) {
            _curGroup = {
              id: '',
              section: Immutable.fromJS({ name: '', type: FIELD_TYPES.GROUP }),
              fields: [],
              values: {}
            };
            sections.push(_curGroup);
          }
          _curGroup.fields.push(field);
          _curGroup.values[field.get('id')] = values && values.get(field.get('id'));
        }
      });
    }

    return (
      <div>
        {
          sections.map((sec) => {
            return <div key={sec.id}>

              <Row type="flex" justify="space-between" className={styles.sectionHeader} onClick={this.toggleList}>
                <span className={styles.headerText}>{this.props.section.get('name')}</span>
                {
                  /*!this.state.open ?
                    <span className={styles.headerCount}>{trs('record.groupFieldsCount', this.props.fields.length)}</span>
                    : null*/
                }
              </Row>
              {/*<div style={!this.state.open ? { display: 'none' } : null} className={styles.sectionFields}>*/}
              <div className={styles.sectionFields}>
                {
                  meta.map((controlConfig) => {
                    let Control = fieldComponentsByType[controlConfig.get('type')];
                    let fieldError = null;
                    let fieldId = controlConfig.get('id');
                    _.forEach(this.state.errors, (error) => {
                      if (error.fieldId === fieldId) {
                        fieldError = error.error;
                      }
                    });

                    return (
                      <ControlItem key={this.props.catalogId + '_' + this.props.recordId + '_' + controlConfig.get('id')}
                        value={this.props.values[controlConfig.get('id')]}
                        controlConfig={controlConfig}
                        error={fieldError}
                      >
                        <Control
                          value={this.props.values[controlConfig.get('id')]}
                          field={controlConfig}
                          recordId={this.props.recordId}
                          catalogId={this.props.catalogId}
                          onSave={(val) => this.onSaveField(controlConfig.get('id'), val)}
                          onUpdate={(val) => this.onUpdateField(controlConfig, val)}
                          updateProcess={record.getIn(['updateProcesses', 'fields', controlConfig.get('id')])}
                          error={fieldError}
                        />
                      </ControlItem>
                    );
                  })
                }
              </div>
            </div>
          })
        }
      </div>
    );
  }
}

export default connect(ControlList, ['catalogs', 'records']);
