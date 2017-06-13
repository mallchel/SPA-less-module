import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Icon } from 'antd'

import router from '../../router'
import trs from '../../getTranslations'
import DropdownButton from '../common/DropdownButton'
import { base, alert } from '../common/Modal'
import IconsModal from '../common/IconsModal'
import editorActions from '../../actions/editorActions'
import apiActions from '../../actions/apiActions'
import { connect } from '../StateProvider'
import ButtonTransparent from '../common/elements/ButtonTransparent'

const CatalogEditorHeader = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    // catalog: React.PropTypes.object.isRequired,
    // sectionId: React.PropTypes.string.isRequired,
    // disabled: React.PropTypes.bool
  },

  getInitialState() {
    return {
      name: ''
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
    const catalog = this.props.catalogs.get(this.props.match.params.catalogId);
    base(IconsModal, {
      header: catalog.get('name'),
      currentIcon: catalog.get('icon'),
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
    const catalogId = this.props.match.params.catalogId;
    const catalog = this.props.catalogs.get(catalogId);
    if (catalog) {
      this.setState({
        name: catalog.get('name')
      })
    }
  },

  componentWillReceiveProps(nextProps) {
    const catalogId = this.props.match.params.catalogId;
    const newCatalogId = nextProps.match.params.catalogId;
    if (!nextProps.catalogs.size) {
      return
    }
    const err = this.props.catalogs.getIn([newCatalogId, 'updateError']) || this.props.catalogs.getIn([newCatalogId, 'createError']);
    const wasMutating = this.props.catalogs.getIn([catalogId, 'updating']) || this.props.catalogs.getIn([catalogId, 'creating']);
    const isMutating = this.props.catalogs.getIn([newCatalogId, 'updating']) || this.props.catalogs.getIn([newCatalogId, 'creating']);
    if (wasMutating && !isMutating && err) {
      alert({
        headerText: trs('modals.saveError.headerText'),
        text: trs('modals.saveError.text'),
        okText: trs('modals.saveError.okText')
      });
    }

    const nameCatalog = nextProps.catalogs.getIn([newCatalogId, 'name']);
    if (this.state.name !== nameCatalog) {
      this.setState({
        name: nameCatalog
      })
    }
  },

  render() {
    const icon = (this.props.catalog && this.props.catalog.get('icon')) || 'content-11';
    return (
      <div>
        <ButtonTransparent
          onClick={this.changeIcon}
          disabled={this.props.disabled}
        >
          <Icon type={`icon ${icon}`} />
        </ButtonTransparent>
        {/*<button disabled={this.props.disabled} className="btn editor-header__icon-btn" onClick={this.changeIcon}>
          <div className={'anticon-icon ' + icon}></div>
        </button>*/}
        <input ref="inputText" type="text" disabled={this.props.disabled}
          className="editor-header__input"
          onChange={this.onChangeName}
          value={this.state.name} />

        {/*<h1 className="header__data__title">
          <span>&nbsp;</span>
        </h1>*/}

        <DropdownButton
          disabled={this.props.disabled}
          items={[]}
          text={this.props.disabled ? trs('buttons.saving') : trs('buttons.save')}
          type="success"
          onClick={this.save} />

        <span onClick={this.close} className="m-close"></span>
      </div>
    );
  }

});

export default connect(CatalogEditorHeader, ['catalogs']);
