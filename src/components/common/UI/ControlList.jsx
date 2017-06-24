import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Row } from 'antd'
import Immutable from 'immutable'
import FIELD_TYPES from '../../../configs/fieldTypes'
import trs from '../../../getTranslations'
import ControlItem from './ControlItem'

import styles from './controlList.less'

const fieldComponentsByType = {
  [FIELD_TYPES.TEXT]: require('./controls/Text').default,
  [FIELD_TYPES.CONTACT]: require('./controls/Contact').default,
  [FIELD_TYPES.NUMBER]: require('./controls/Number').default,
  [FIELD_TYPES.DATE]: require('./controls/Date').default,

  [FIELD_TYPES.DROPDOWN]: require('./controls/Category').default,
  [FIELD_TYPES.CHECKBOXES]: require('./controls/Checkboxes').default,
  [FIELD_TYPES.RADIOBUTTON]: require('./controls/Radiobutton').default,

  [FIELD_TYPES.PROGRESS]: require('./controls/Progress').default,
  [FIELD_TYPES.STARS]: require('./controls/Stars').default,

  // [FIELD_TYPES.OBJECT]: require('./controls/ObjectField').default,
  [FIELD_TYPES.USER]: require('./controls/User').default,
  // [FIELD_TYPES.FILE]: require('./controls/FileField').default,
};

let idPrefix = 0;

class ControlList extends Component {
  static propTypes = {
    values: PropTypes.object.isRequired,
    configs: PropTypes.object.isRequired,
    onSaveField: PropTypes.func.isRequired,
    onUpdateField: PropTypes.func.isRequired
  }

  state = {
    open: true
  }

  idPrefix = idPrefix++;

  // updateErrorFields(event) {
  //   if (event.event == 'onErrors') {
  //     if (event.errors[this.props.catalogId]) {
  //       this.setState({ errors: event.errors[this.props.catalogId][this.props.recordId] });
  //     }
  //     let sectionHasErrors = false;
  //     this.props.fields.forEach((field) => {
  //       _.forEach(this.state.errors, (error) => {
  //         if (error.fieldId == field.get('id')) {
  //           sectionHasErrors = true;
  //         }
  //       });
  //     });
  //     if (sectionHasErrors) {
  //       this.setState({ open: true });
  //     }
  //   }
  // }

  toggleList = () => {
    this.setState({
      open: !this.state.open
    });
  }

  onSaveField(configId, data) {
    this.props.onSaveField(configId, data);
  }

  componentDidUpdate() {
    if (this.errorControl) {
      this.errorControl.focus();
    }
  }

  render() {
    let sections = [];
    let _curGroup;
    const configs = this.props.configs;
    const values = this.props.data;

    const firstError = configs.find(f => f.get('error'));

    if (configs.size !== 0) {
      configs.forEach((config) => {
        if (config.get('type') === FIELD_TYPES.GROUP) {
          _curGroup = {
            id: config.get('id'),
            section: config,
            configs: [],
            values: {}
          };
          sections.push(_curGroup);
        } else {
          if (!_curGroup) {
            _curGroup = {
              id: '',
              section: Immutable.fromJS({ name: '', type: FIELD_TYPES.GROUP }),
              configs: [],
              values: {}
            };
            sections.push(_curGroup);
          }
          _curGroup.configs.push(config);
          _curGroup.values[config.get('id')] = values && values.get(config.get('id'));
        }
      });
    }
    return (
      <div>
        {
          sections.map((sec) => {
            return <div key={sec.id}>
              <Row type="flex" justify="space-between" className={styles.sectionHeader} onClick={this.toggleList}>
                <span className={styles.headerText}>{sec.section.get('name')}</span>
                {
                  !this.state.open ?
                    <span className={styles.headerCount}>{trs('record.groupFieldsCount', this.props.configs.length)}</span>
                    : null
                }
              </Row>
              <div style={!this.state.open ? { display: 'none' } : null} className={styles.sectionFields}>
                {
                  sec.configs.map((controlConfig) => {
                    const Control = fieldComponentsByType[controlConfig.get('type')];

                    const htmlId = this.idPrefix + controlConfig.get('id');
                    return (
                      <ControlItem
                        labelRef={firstError && firstError.get('id') === controlConfig.get('id') && (node => this.errorControl = node)}
                        htmlId={htmlId}
                        key={controlConfig.get('id')}
                        controlConfig={controlConfig}
                        error={controlConfig.get('error')}
                        name={controlConfig.get('name')}
                        required={controlConfig.get('required')}
                        type={controlConfig.get('type')}
                        readOnly={controlConfig.get('readOnly')}
                        hint={controlConfig.get('hint')}
                      >
                        <Control
                          htmlId={htmlId}
                          value={this.props.values.get(controlConfig.get('id'))}
                          controlConfig={controlConfig}
                          hint={controlConfig.get('hint')}
                          readOnly={controlConfig.get('readOnly')}
                          config={controlConfig.get('config')}
                          onSave={(val) => this.onSaveField(controlConfig.get('id'), val)}
                          onUpdate={(val) => this.props.onUpdateField(controlConfig.get('id'), val)}
                          updateProcess={controlConfig.get('updateProcesses')}
                          error={controlConfig.get('error')}
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

export default ControlList;
