import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Icon, Input, Button, Row } from 'antd'
import PropTypes from 'prop-types'

import trs from '../../getTranslations'
import { alert } from '../common/Modal'
import IconsModal from '../common/IconsModal'
import editorActions from '../../actions/editorActions'
import apiActions from '../../actions/apiActions'
import { connect } from '../StateProvider'
// import ButtonTransparent from '../common/elements/ButtonTransparent'
import ButtonClose from '../common/elements/ButtonClose'
import { renderModaltoBody } from '../common/Modal'
// import catalogActions from '../../actions/catalogActions'

import styles from './catalogEditor.less'

const CatalogEditorHeader = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    catalog: PropTypes.object.isRequired,
    disabled: PropTypes.bool
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
    editorActions.setCatalogName(this.props.match.params.sectionId, newName);
  },

  onChangeIcon(icon) {
    editorActions.setCatalogIcon(this.props.match.params.sectionId, icon);
  },

  changeIcon() {
    const catalog = this.props.catalog;
    renderModaltoBody(IconsModal, {
      header: catalog.get('name'),
      currentIcon: catalog.get('icon'),
      onSave: this.onChangeIcon
    })
  },

  save(history) {
    // need refactor, take out to BL.
    let c = this.props.catalog.toJS();
    const sectionId = this.props.match.params.sectionId;
    let data = {
      name: c.name,
      icon: c.icon,
      sectionId: sectionId,
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
        sectionId: sectionId
      }, data);
      history.push(`/section/${sectionId}/catalog/${c.id}`);
    } else {
      apiActions.createCatalog({
        sectionId: sectionId
      }, data).then((result) => {
        history.push(`/section/${sectionId}/catalog/${result.id}`);
      });
    }
  },

  access() {

  },

  changeRouteOnClose(history) {
    if (this.props.catalog.get('isNew')) {
      history.push(`/section/${this.props.match.params.sectionId}`);
    } else {
      history.push(`/section/${this.props.match.params.sectionId}/catalog/${this.props.catalog.get('id')}`);
    }
  },

  close(history) {
    this.changeRouteOnClose(history);
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
      <Row type="flex" justify="space-between" align="middle" className={styles.header}>
        <Row type="flex">
          <Button
            onClick={this.changeIcon}
            disabled={this.props.disabled}
            className={styles.headerIcon}
          >
            <Icon style={{ fontSize: '1.43em' }} type={`icon ${icon}`} />
          </Button>
          <Input
            ref="inputText"
            disabled={this.props.disabled}
            onChange={this.onChangeName}
            defaultValue={this.state.name} />
        </Row>
        <Row type="flex" align="middle">
          <Button type="primary" disabled={this.props.disabled} onClick={() => this.save(this.props.history)}>{this.props.disabled ? trs('buttons.saving') : trs('buttons.save')}</Button>
          <ButtonClose
            onClick={() => this.close(this.props.history)}
            className={styles.headerClose}
          />
        </Row>
      </Row>
    );
  }

});

export default connect(CatalogEditorHeader, ['catalogs']);
