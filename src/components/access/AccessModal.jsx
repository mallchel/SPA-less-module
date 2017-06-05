import _ from 'lodash'
import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Immutable from 'immutable'
import classNames from 'classnames'
import CSSTransitionGroup from 'react-addons-css-transition-group'
import { Modal, Button } from 'antd'
import PropTypes from 'prop-types'

import { connect } from '../StateProvider'
import trs from '../../getTranslations'
import Dropdown from '../common/Dropdown'
import DropdownRemote from '../common/DropdownRemote'
import RightsExceptions from './RightsExceptions'
import antiCapitalize from '../../utils/antiCapitalize'
import apiActions from '../../actions/apiActions'
import modalsActions from '../../actions/modalsActions'
import HelpIcon from '../common/HelpIcon'

import PRIVILEGE_CODES from '../../configs/privilegeCodes'
import RESOURCE_TYPES from '../../configs/resourceTypes'

import PublicAccess from './publicAccess'

const log = require('debug')('CRM:Component:Rights:Modal');

const MIN_RULES = 7;

function modalTrs(path, n) {
  return trs('modals.access.' + path)
}

// этот компонент нужен на случай, если правила будут в контейнере фиксированной высоты и надо будет
// при добавлении нового правила прокуручивать контейнер вниз
const AccessRules = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    resource: React.PropTypes.string.isRequired,
    privilegeCodes: React.PropTypes.object.isRequired,
    rules: React.PropTypes.object,
    object: React.PropTypes.object,
    parentCatalog: React.PropTypes.object,
    parentSection: React.PropTypes.object,
    onClickRemoveRight: React.PropTypes.func,
    onChangePrivilege: React.PropTypes.func,
    readOnly: React.PropTypes.bool,
    isAdmin: React.PropTypes.bool,
    rulesTableClasses: React.PropTypes.string
  },

  getInitialState() {
    return {
      rules: this.props.rules
    };
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.rules) {
      this.setState({
        rules: nextProps.rules
      });
    }
  },

  getPrivilegeText(privilegeCode) {
    return modalTrs(`privileges.${this.props.resource}.${privilegeCode}`)
  },

  render() {
    let rules;

    //Константы определяющие для какого объекта защиты открыто окно доступа
    const isSection = !!(this.props.object && this.props.object.sectionId);
    // Пока используется только isSection для показа кнопки исключений из прав
    // const isCatalog = !!(this.props.object && this.props.object.catalogId);
    // const isView    = !!(this.props.object && this.props.object.viewId);
    // const isRecord  = !!(this.props.object && this.props.object.recordId);

    if (this.state.rules) {
      let privileges = this.props.privilegeCodes.map(p => {
        return {
          key: p,
          text: this.getPrivilegeText(p)
        }
      }).toJS(); // toJS for DropDown

      rules = this.state.rules.map((rule, index) => {
        let subject = rule.getIn(['rightSubject']);
        let attr = subject.getIn(['userAttr']);
        let attrTitle = antiCapitalize(subject.getIn(['userAttrTitle']));
        let privilegeCode = rule.getIn(['privilegeCode']);
        let subjectPrivileges = privileges.slice();

        let subjectIcon = subject.getIn(['catalogIcon']) || (attr === 'id' && 'users-9') || 'users-24';
        let subjectDescription;
        let privilegeView;
        let privilegeFieldText = [];
        let rightsExceptions = [];
        let privilegeField = null;
        let subjectName = subject.getIn(['recordTitle']);
        let subjectTitle = subjectName;
        let readOnly = (this.props.readOnly || privilegeCode == PRIVILEGE_CODES.ADMIN) && !this.props.isAdmin;
        let hasRemoveBtn = privilegeCode != PRIVILEGE_CODES.SEARCH;

        let onClickRemove = () => {
          this.props.onClickRemoveRight(index);
        };

        let onChangePrivilege = items => {
          this.props.onChangePrivilege(index, items);
        };
        let openViewFieldRightsModal = () => {
          const object = this.props.object;
          let basePrivilege = (
            privilegeCode == PRIVILEGE_CODES.VIEW ||
            privilegeCode == PRIVILEGE_CODES.ACCESS ||
            privilegeCode == PRIVILEGE_CODES.SEARCH
          ) ? 'view' : 'edit';
          modalsActions.openViewFieldRightsModal(
            rule,
            index,
            object,
            basePrivilege,
            (fields) => {
              this.props.onChangeRule(index, rule.set('fields', fields));
              log('Field rights modal saved');
            }, () => {
              log('Field rights modal dismised');
            });
        };

        if (attrTitle) {
          subjectDescription = <span className="m-text_light"> ({attrTitle})</span>;
          subjectTitle += ` (${attrTitle})`;
        }

        // workaround. because Dropdown incorrect work, while privileges array is empty
        // workaround. to show search privilege
        if (!_.find(subjectPrivileges, { key: privilegeCode })) {
          subjectPrivileges.unshift({
            key: privilegeCode,
            text: this.getPrivilegeText(privilegeCode)
          });
        }

        if (attr === 'allUsers') {
          _.remove(subjectPrivileges, p => p.key === PRIVILEGE_CODES.DENY);
        }

        if (!this.props.isAdmin) {
          _.remove(subjectPrivileges, p => p.key === PRIVILEGE_CODES.ADMIN);
        }

        if (readOnly) {
          privilegeView = <span className="access-modal__privilege-view">{this.getPrivilegeText(privilegeCode)}</span>;
        } else {
          privilegeView =
            <div className="access-modal__privilege-editor">
              <Dropdown
                withButton={true}
                value={privilegeCode}
                items={subjectPrivileges}
                onSelectItems={onChangePrivilege} />
            </div>;
        }

        let fieldsRules = rule.get('fields') || new Immutable.Map();
        if (
          !isSection
          && ([
            PRIVILEGE_CODES.VIEW,
            PRIVILEGE_CODES.EDIT,
            PRIVILEGE_CODES.CREATE,
            PRIVILEGE_CODES.EXPORT,
            PRIVILEGE_CODES.DELETE,
            PRIVILEGE_CODES.ACCESS,
            PRIVILEGE_CODES.ADMIN
          ].indexOf(privilegeCode) != -1)
          && !readOnly
        ) {
          let className = classNames({
            'm-like-button': true,
            hasRules: fieldsRules.size != 0,
            noRules: fieldsRules.size == 0
          });
          privilegeField = (<a className={className} onClick={openViewFieldRightsModal} title={modalTrs('byFields')}>
            <span className='icon icon--edition-31'></span>
          </a>);
        }

        let basePrivilege = (
          privilegeCode == PRIVILEGE_CODES.VIEW
        ) ? 'view' : 'edit';
        if (fieldsRules.size != 0) {
          rightsExceptions = <RightsExceptions exceptions={fieldsRules} basePrivilege={basePrivilege} />;
        }
        // rights__row--group

        let removeBlock = null;

        if (!readOnly) {
          removeBlock =
            <div className="click-area--close" onClick={onClickRemove}>
              {hasRemoveBtn ? <i className="m-close m-close--absolute"></i> : null}
            </div>
        } else if (rule.getIn(['fromObject'])) {
          let fromObjIcon;
          let fromTitle;

          if (rule.getIn(['fromObject', 'sectionId'])) {
            fromObjIcon = this.props.parentSection && this.props.parentSection.get('icon');
            fromTitle = modalTrs('inheritedFromSection');
          } else if (rule.getIn(['fromObject', 'catalogId'])) {
            fromObjIcon = this.props.parentCatalog && this.props.parentCatalog.get('icon');
            fromTitle = modalTrs('inheritedFromCatalog');
          }

          if (fromObjIcon) {
            removeBlock =
              <span title={fromTitle}>
                {modalTrs('from')} <span className={'icon access-modal-rule__icon--from icon--' + fromObjIcon}></span>
              </span>
          }
        }

        return (
          <tr className={"unit-list__row rights__row" + (!hasRemoveBtn && ' rights__row--undeletable' || '')} key={index}>
            <td className="rights__row__item rights__row__item--icon">
              <i className={"avatar m-text_light rights__row__item-icon icon icon--" + subjectIcon}></i>
            </td>
            <td className="rights__row__item rights__row__item--subject" title={subjectTitle}>
              <span>{subjectName}</span>{subjectDescription}
            </td>
            <td className="rights__row__item rights__row__item--privilege">
              {privilegeView}
              {rightsExceptions}
            </td>
            <td className="rights__row__item rights__row__item--field">
              {privilegeField}
            </td>
            <td className="rights__row__item rights__row__item--close">
              {removeBlock}
            </td>
          </tr>
        );
      });
    } else {
      rules = Immutable.fromJS([]);
    }

    return (
      <table className={'unit-list unit-list--padding_default m-bg-color_white rights__table'
        + (this.props.readOnly ? ' unit-list--hover_off' : '')
        + ' ' + this.props.rulesTableClasses}>
        <tbody>
          {rules}
        </tbody>
      </table>
    );
  }
});

const EmptyRules = React.createClass({
  propTypes: {
    count: React.PropTypes.number.isRequired
  },

  render() {
    let count = Math.max(this.props.count, 1);
    let emptyList = [];

    for (let i = 0; i < count; i++) {
      emptyList.push(
        <tr className="unit-list__row" key={i}>
          <td className="rights__row__item" colSpan={3}></td>
        </tr>
      );
    }

    return (
      <table className="unit-list unit-list--padding_default unit-list--hover_off m-bg-color_white rights__table">
        <tbody>
          {emptyList}
        </tbody>
      </table>
    );
  }
});

const AccessModal = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    resource: PropTypes.string.isRequired,
    privilegeCodes: PropTypes.object,
    object: PropTypes.object.isRequired,
    parentCatalog: PropTypes.object,
    parentSection: PropTypes.object,
    rules: ImmutablePropTypes.list,
    parents: ImmutablePropTypes.list,
    isLoading: PropTypes.bool,
    readOnly: PropTypes.bool,
    hasAdminRule: PropTypes.bool,
    onOk: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  },

  getDefaultProps() {
    return {
      privilegeCodes: new Immutable.List()
    };
  },

  getInitialState() {
    return {
      rules: this.mergeRules(this.props.rules || new Immutable.List),
      selectedSubjects: new Immutable.List,
      isLoading: true
    }
  },

  mergeRules(rules) {
    let toRemoveRules = [];

    rules.forEach((rule, i) => {
      // mark rule as search privilege
      if (rule.get('privilegeCode') === PRIVILEGE_CODES.SEARCH) {
        rules = rules.setIn([i, 'isSearchRule'], true);
      } else {
        let searchRuleIndex = rules.findIndex((rule2, i2) => {
          return i !== i2
            && rule2.get('privilegeCode') === PRIVILEGE_CODES.SEARCH
            && _.isEqual(rule.get('rightSubject').toJS(), rule2.get('rightSubject').toJS());
        });

        // merge subjects with search privilege and other
        if (searchRuleIndex > -1) {
          rules = rules.setIn([searchRuleIndex, 'privilegeCode'], rule.get('privilegeCode'));
          //rules = rules.remove(i);
          toRemoveRules.push(i);
        }
      }
    });

    rules = rules.filter((o, i) => !_.contains(toRemoveRules, i));

    return rules;
  },

  updateState(obj) {
    // merge subjects with search privilege and other and remove search rules
    if (obj.rules) {
      obj.rules = this.mergeRules(obj.rules);
    }

    return this.setState(obj);
  },

  onAddSubjects(items) {
    log('add subjects', items);
    if (items.length == 0) {
      return;
    }
    //let items = this.state.selectedSubjects.toJS();
    let newRules = items.map(item => {
      return Immutable.fromJS({
        rightSubject: item.subject,
        privilegeCode: PRIVILEGE_CODES.EDIT
      });
    });

    this.updateState({
      rules: this.state.rules.push(...newRules),
      selectedSubjects: Immutable.fromJS([])
    })
  },

  filterAvailableSubjects(item) {
    return !this.state.rules.find(rule => {
      return _.isEqual(rule.getIn(['rightSubject']).toJS(), item.subject);
    });
  },

  onClickRemoveRight(index) {
    if (this.state.rules.getIn([index, 'isSearchRule'])) {
      this.onChangePrivilege(index, PRIVILEGE_CODES.SEARCH);
    } else {
      this.updateState({
        rules: this.state.rules.splice(index, 1)
      });
    }
  },

  onSave() {
    let data = {
      object: this.props.object,
      rules: this.state.rules
    };

    apiActions.createRight({}, data);
    this.props.onOk(this.props.object);
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.rules !== nextProps.rules) {
      log('new rules from props', nextProps.rules);

      this.updateState({
        rules: nextProps.rules || Immutable.fromJS([])
      });
    }

    this.updateState({
      isLoading: nextProps.isLoading
    });
  },

  componentDidMount() {
    let object = this.props.object;

    let query = {
      withSearch: true
    };

    apiActions.getRights({}, _.extend({}, query, object));

    // get rules for parent objects
    this.props.parents.forEach(ro => {
      apiActions.getRights({}, _.extend({}, query, ro.get('object').toJS()));
    });

    if (!this.props.privilegeCodes.size) {
      apiActions.getPrivileges();
    }
  },

  onChangePrivilege(indexOfRule, items) {
    let privilegeCode = _.get(items, '[0].key', items);
    this.updateState({
      rules: this.state.rules.setIn([indexOfRule, 'privilegeCode'], privilegeCode).setIn([indexOfRule, 'fields'], Immutable.fromJS({}))
    });
  },

  onChangeRule(indexOfRule, rule) {
    this.updateState({
      rules: this.state.rules.set(indexOfRule, rule)
    });
  },

  itemsMapper(item) {
    let userAttrTitle = antiCapitalize(item.subject.userAttrTitle);
    let subjectDescription;

    if (userAttrTitle) {
      subjectDescription = <span className="m-text_light">({userAttrTitle})</span>;
    }

    item.component = <span>{item.text} {subjectDescription}</span>;
    return item;
  },

  render() {
    let readOnly = this.props.readOnly;
    let { isLoading } = this.state;
    let error = null;
    let resource = this.props.resource;

    let rules = this.state.rules;

    if (this.props.hasAdminRule) {
      let adminRule = rules.find(rule => rule.get('privilegeCode') === PRIVILEGE_CODES.ADMIN);

      if (!adminRule) {
        error = modalTrs('errors.adminPrivilegeRequired');
      }
    }

    let addSubjects =
      <div className="modal-window__content--footer">
        <table className="rights--footer unit-list unit-list--padding_default m-bg-color_white rights__table--footer ng-scope">
          <tbody>
            <tr className="rights__row">
              <td className="rights__row__item rights__row__item--icon">
                <i className="icon icon--interface-69 rights__row__item-icon rights__row__item-icon--plus m-text_light"></i>
              </td>
              <td className="rights__row__item w100" colSpan="3">
                <DropdownRemote
                  type="subjects"
                  filterFn={this.filterAvailableSubjects}
                  sortBy={false}
                  multiselect={false}
                  autocomplete={true}
                  searchable={true}
                  onSelectItems={this.onAddSubjects}
                  clearOnSelect={true}
                  closeOnSelect={true}
                  itemsMapper={this.itemsMapper}
                  placeholder={modalTrs('selectSubject')}
                  withButton={true}
                  blockForceUpdateForEmpty={true}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>;

    let parentRules = new Immutable.List();

    this.props.parents.forEach(ro => {
      let parentObjectRules = ro.get('rules');
      parentObjectRules && parentObjectRules.forEach(rule => {
        rule = rule.set('fromObject', ro.get('object'));

        if (rule.get('privilegeCode') === PRIVILEGE_CODES.SEARCH) {
          return;
        }

        if (resource === RESOURCE_TYPES.VIEW) {
          if (rule.get('privilegeCode') === PRIVILEGE_CODES.ADMIN) {
            parentRules = parentRules.push(rule);
          }
        } else {
          parentRules = parentRules.push(rule);
        }
      });
    });

    return (
      <Modal
        visible={true}
        maskClosable={false}
        closable={false}
        footer={[
          <Button key="submit" type="primary" size="large" onClick={this.onSave}>{trs('buttons.save')}</Button>,
          <Button key="back" type="default" size="large" onClick={this.props.onCancel}>{trs('buttons.cancel')}</Button>,
        ]}
        width='60%'
      >
        <div>
          <header className="modal-window__header">
            <i className="modal-window__header__close" onClick={this.props.onCancel}></i>
            <h2 className="modal-window__header__title">
              {modalTrs('header')} {modalTrs('headerSuffix.' + this.props.resource)}
              {' '}
              <HelpIcon helpPath='policy.html' />
            </h2>
          </header>
          <div className="modal-window__content rights">
            <div className="modal-window__content__padding modal-window__content--caption">
              <div>
                <div className="access-modal__caption-element"><h2 className="popup--share__head">{modalTrs('stuffs')}</h2></div>
                <div className="access-modal__caption-element access-modal__caption-element--right">
                  <CSSTransitionGroup
                    className="m-text_light"
                    transitionName="access-modal__loading"
                    transitionEnterTimeout={10}
                    transitionLeaveTimeout={300}>
                    {isLoading ? <span>{modalTrs('loading')}</span> : null}
                  </CSSTransitionGroup>
                </div>
              </div>

              <div className="access-modal__rules">
                <AccessRules
                  rules={parentRules}
                  parentCatalog={this.props.parentCatalog}
                  parentSection={this.props.parentSection}
                  resource={resource}
                  privilegeCodes={this.props.privilegeCodes}
                  readOnly={true}
                  rulesTableClasses="rights__table--readonly"
                />

                <AccessRules
                  rules={this.state.rules}
                  resource={this.props.resource}
                  privilegeCodes={this.props.privilegeCodes}
                  object={this.props.object}
                  readOnly={readOnly}
                  isAdmin={this.props.isAdmin}
                  onClickRemoveRight={this.onClickRemoveRight}
                  onChangePrivilege={this.onChangePrivilege}
                  onChangeRule={this.onChangeRule}
                />

                <EmptyRules
                  count={MIN_RULES - this.state.rules.size - parentRules.size}
                />
              </div>

              {readOnly ? <div className="rights__line"></div> : null}

              {readOnly ? null : addSubjects}

              <PublicAccess resource={this.props.resource} object={this.props.object} />
            </div>
          </div>
        </div>
      </Modal>
    );
  }
});

const AccessModalController = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    object: React.PropTypes.object.isRequired,
    parents: React.PropTypes.array,
    resource: React.PropTypes.string.isRequired
  },

  updateStateFromProps(props) {
    let parentsLoadingComplete = true;
    let parentCatalog = null;
    let parentSection = null;

    let objectInfo = this.getInfoForObject(props, props.object);

    // parent objects info
    let newParents = this.state.parents;

    if (props.parents) {
      let parentRights = props.parents.map(object => {
        let parentRight = this.getInfoForObject(props, object);
        parentRight.object = object;

        parentsLoadingComplete = parentsLoadingComplete && parentRight.loadingComplete;

        if (object.sectionId) {
          // parentSection = appState.get('sections').find(o => o.get('id') === object.sectionId);
          parentSection = this.props.sections.find(o => o.get('id') === object.sectionId);
        } else if (object.catalogId) {
          // parentCatalog = appState.get('catalogs').find(o => o.get('id') === object.catalogId);
          parentCatalog = this.props.catalogs.find(o => o.get('id') === object.catalogId);
        }

        return parentRight;
      });

      newParents = newParents.mergeDeep(parentRights);

      newParents.forEach((o, i) => {
        let rules = o.get('rules');
        if (rules) {
          let newParentObj = o.set('rules', rules.setSize(_.get(parentRights, [i, 'rules', 'size'], 0)));
          newParents = newParents.set(i, newParentObj);
        }
      });
    }

    newParents = newParents.setSize(_.get(props, 'parents.length', 0));

    this.setState({
      parents: newParents,
      rules: objectInfo.rules,
      loadingComplete: objectInfo.loadingComplete && parentsLoadingComplete,
      parentCatalog,
      parentSection
    });
  },

  getInitialState() {
    return {
      parents: new Immutable.List(),
      rules: null,
      isLoading: null
    };
  },

  componentWillMount() {
    this.updateStateFromProps(this.props);
  },

  getInfoForObject(props, object) {
    let rightsCollection = this.props.rights;
    // let rightsCollection = appState.get('rights');
    let rightsObject = rightsCollection.find(ro => {
      return _.isEqual(ro.getIn(['object']).toJS(), object);
    });
    let rules = rightsObject && rightsObject.getIn(['rules']);
    let loadingComplete = rightsObject && rightsObject.getIn(['loadingComplete']);

    return { rules, loadingComplete };
  },

  componentWillReceiveProps(nextProps) {
    this.updateStateFromProps(nextProps);
  },

  render() {
    let { rules, loadingComplete, parents, parentCatalog, parentSection } = this.state;

    let resource = this.props.resource;
    // let privilegeCodes = appState.getIn(['privilegeCodesByResource', resource]);
    let privilegeCodes = this.props.privilegeCodesByResource.get(resource);
    return <AccessModal
      resource={resource}
      privilegeCodes={privilegeCodes}
      object={this.props.object}
      rules={rules}
      parents={parents}
      readOnly={this.props.readOnly}
      hasAdminRule={this.props.hasAdminRule}
      isAdmin={this.props.isAdmin}
      isLoading={!loadingComplete}
      onOk={this.props.onOk}
      onCancel={this.props.onCancel}
      parentCatalog={parentCatalog}
      parentSection={parentSection}
    />
  }
});

export default connect(AccessModalController, ['sections', 'catalogs', 'privilegeCodesByResource', 'rights']);
