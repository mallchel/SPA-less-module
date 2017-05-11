import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import _ from 'lodash';
import Immutable from 'immutable';
import trs from '../../getTranslations';
import RightsFields from './rights/RightsFields';
import HelpIcon from '../common/HelpIcon';
import appState from '../../appState'

const log = require('debug')('CRM:Component:FieldRights:Modal');

function modalTrs(path, n) {
  return trs('modals.fieldRights.' + path)
}

const FieldRightsModal = React.createClass({
  mixins: [PureRenderMixin],

  getDefaultProps() {
    return {
      rules: new Immutable.Map(),
      index: null,
      basePrivilege: 'view'
    };
  },

  getInitialState() {
    return {
      isLoading: false,
      fields: new Immutable.Map(),
      index: null
    }
  },

  onSave(){
    this.props.closeModal(this.state.fields);
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.rule) {
      this.setState({fields: nextProps.rule.get('fields') || new Immutable.Map()});
    }
  },
  componentDidMount() {
    this.setState({fields: this.props.rule.get('fields') || new Immutable.Map()});
  },
  onSaveField(fieldId, privilege) {
    log({fieldId, privilege});
    let fields = this.state.fields || new Immutable.Map();
    fields = fields.set(fieldId, privilege);
    this.setState({
      fields: fields
    });
  },

  render() {
    let readOnly = this.props.readOnly;
    let fieldsValues = this.state.fields? this.state.fields.toJS(): {};
    let error = null;

    let footerContent =
      <div>
        {readOnly
          ? null
          : <button className="btn btn--default" onClick={this.onSave}>{trs('modals.save')}</button>}
        <a href="javascript:void(0)"
           className="m-like-button"
           onClick={this.props.dismissModal}>{readOnly ? trs('modals.close') : trs('modals.cancel')}
        </a>
      </div>;

    let currentCatalogId = appState.getIn(['routeParams', 'catalogId']);
    let fields = appState.getIn(['currentCatalog', 'fields']);

    return (
      <div>
        <header className="modal-window__header">
          <i className="modal-window__header__close" onClick={this.props.dismissModal}></i>
          <h2 className="modal-window__header__title">
            {modalTrs('header')}
            {' '}
            <HelpIcon helpPath='policy-fields.html' />
          </h2>
        </header>
        <div className="modal-window__content">
          <div className="fieldRights-modal__fields-holder">
            <RightsFields
              catalogId={currentCatalogId}
              fields={fields}
              values={fieldsValues}
              appState={this.props.appState}
              onSaveField={this.onSaveField}
              basePrivilege={this.props.basePrivilege}
            />
          </div>
        </div>
        <footer className="modal-window__footer">
          {error && !this.state.isLoading ? <span className="m-text_danger">{error}</span> : footerContent}
        </footer>
      </div>
    );
  }
});

const FieldRightsModalController = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    object: React.PropTypes.object.isRequired,
    parents: React.PropTypes.array
  },

  getInitialState() {
    return {
      parents: new Immutable.List(),
      rule: new Immutable.Map(),
      isLoading: null
    };
  },

  componentWillMount() {
    this.updateStateFromProps(this.props);
  },

  componentWillReceiveProps(nextProps) {
    this.updateStateFromProps(nextProps);
  },

  updateStateFromProps(props) {
    let parentsLoadingComplete = true;
    let parentCatalog = null;
    let parentSection = null;

    this.setState({
      parentCatalog,
      parentSection
    });
  },

  render() {
    let {rules, loadingComplete, parents, parentCatalog, parentSection} = this.state;
    let fields = this.props.rule.get('fields') || {};
    return <FieldRightsModal
      closeModal={this.props.closeModal}
      dismissModal={this.props.dismissModal}
      appState={this.props.appState}
      rule={this.props.rule}
      index={this.props.index}
      fields={this.props.fields}
      object={this.props.object}
      basePrivilege={this.props.basePrivilege}
    />;
  }
});

export default FieldRightsModalController;
