import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

import FixedHeader from '../common/FixedHeader'
import router from '../../router'
import trs from '../../getTranslations'
import DropdownButton from '../common/DropdownButton'
import { base, alert } from '../common/Modal'
import IconsModal from '../common/IconsModal'
import editorActions from '../../actions/editorActions'
import apiActions from '../../actions/apiActions'

const CatalogEditorHeader = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    catalog: React.PropTypes.object.isRequired,
    sectionId: React.PropTypes.string.isRequired,
    disabled: React.PropTypes.bool
  },

  getInitialState() {
    return {
      name: this.props.catalog.get('name') || ''
    };
  },

  onChangeName(e) {
    let newName = e.target.value || '';
    this.setState({
      name: newName
    });
    editorActions.setCatalogName(this.props.sectionId, newName);
  },

  onChangeIcon(icon) {
    editorActions.setCatalogIcon(this.props.sectionId, icon);
  },

  changeIcon() {
    base(IconsModal, {
      header: this.props.catalog.get('name'),
      currentIcon: this.props.catalog.get('icon'),
      onSave: this.onChangeIcon
    }, {
        css: 'icons-modal'
      });
  },

  save() {
    // need refactor, take out to BL.
    let c = this.props.catalog.toJS();
    let data = {
      name: c.name,
      icon: c.icon,
      sectionId: this.props.sectionId,
      fields: c.fields.map(f => ({
        id: f.id,
        name: f.name,
        required: f.required,
        hint: f.hint,
        type: f.type,
        config: f.config,
        apiOnly: f.apiOnly
      }))
    };

    if (c.id) {
      apiActions.updateCatalog({
        catalogId: c.id,
        sectionId: this.props.sectionId
      }, data);
    } else {
      apiActions.createCatalog({
        sectionId: this.props.sectionId
      }, data);
    }
  },

  access() {

  },

  changeRouteOnClose() {
    if (this.props.catalog.get('isNew')) {
      router.go('main.section');
    } else {
      router.go('main.section.catalogData', {
        catalogId: this.props.catalog.get('id')
      });
    }
  },

  close() {
    this.changeRouteOnClose();
  },

  componentDidMount() {
    setTimeout(() => {
      //ReactDOM.findDOMNode(this.refs.inputText).focus();
    }, 300);
  },

  componentWillReceiveProps(nextProps) {
    let err = nextProps.catalog.get('updateError') || nextProps.catalog.get('createError');
    let wasMutating = this.props.catalog.get('updating') || this.props.catalog.get('creating');
    let isMutating = nextProps.catalog.get('updating') || nextProps.catalog.get('creating');
    if (wasMutating && !isMutating && err) {
      alert({
        headerText: trs('modals.saveError.headerText'),
        text: trs('modals.saveError.text'),
        okText: trs('modals.saveError.okText')
      });
    }
  },

  render() {

    return (
      <FixedHeader className="editor-header">
        <button disabled={this.props.disabled} className="btn editor-header__icon-btn" onClick={this.changeIcon}>
          <div className={'icon icon--' + this.props.catalog.get('icon')}></div>
        </button>
        <input ref="inputText" type="text" disabled={this.props.disabled}
          className="editor-header__input"
          onChange={this.onChangeName}
          value={this.state.name} />

        <h1 className="header__data__title">
          <span>&nbsp;</span>
        </h1>

        <DropdownButton
          disabled={this.props.disabled}
          items={[]}
          text={this.props.disabled ? trs('buttons.saving') : trs('buttons.save')}
          type="success"
          onClick={this.save} />

        <span onClick={this.close} className="m-close"></span>

      </FixedHeader>
    );
  }

});

export default CatalogEditorHeader;
