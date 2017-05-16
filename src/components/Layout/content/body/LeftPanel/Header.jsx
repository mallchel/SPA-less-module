import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { Menu as AntMenu, Row, Dropdown, Icon } from 'antd'
import ButtonTransparent from '../../../../common/elements/ButtonTransparent'
import { checkAccessOnObject } from '../../../../../utils/rights'
import PRIVILEGE_CODES from '../../../../../configs/privilegeCodes'
import RESOURCE_TYPES from '../../../../../configs/resourceTypes'
import trs from '../../../../../getTranslations'
import { confirm } from '../../../../common/Modal'
import apiActions from '../../../../../actions/apiActions'
import modalsActions from '../../../../../actions/modalsActions';

import styles from './leftPanel.less'

class Header extends Component {
  onClickAccess = (e) => {
    let catalog = this.props.currentCatalog;
    let catalogId = catalog.get('id');
    if (catalogId) {
      let isAdmin = checkAccessOnObject(RESOURCE_TYPES.CATALOG, this.props.currentCatalog, PRIVILEGE_CODES.ADMIN);
      let readOnly = !checkAccessOnObject(RESOURCE_TYPES.CATALOG, this.props.currentCatalog, PRIVILEGE_CODES.ACCESS);
      let object = { catalogId };
      let parents = [{ sectionId: catalog.get('sectionId') }];
      modalsActions.openAccessModal({ object, parents }, RESOURCE_TYPES.CATALOG, { readOnly, isAdmin });
    }
  }
  btnEdit = (e) => {
    return (
      <Redirect to={`section/${this.props.section.get('id')}/catalog/${this.props.currentCatalog.get('id')}/edit`} />
    )
  }
  onOk = (e) => {
    apiActions.deleteCatalog({
      catalogId: this.props.currentCatalog.get('id')
    });
  }
  remove = (e) => {
    confirm({
      title: trs('modals.removeConfirm.headerText'),
      contentText: trs('modals.removeConfirm.text'),
      okText: trs('modals.removeConfirm.okText'),
      cancelText: trs('modals.removeConfirm.cancelText'),
      onOk: this.onOk
    })
  }
  render() {
    let menu = {};
    let currentCatalog = this.props.currentCatalog;
    let isAccessAdmin = checkAccessOnObject(RESOURCE_TYPES.CATALOG, currentCatalog, PRIVILEGE_CODES.ADMIN);

    if (isAccessAdmin) {
      menu = (
        <AntMenu>
          <AntMenu.Item>
            <a rel="noopener noreferrer" onClick={this.onClickAccess}>{trs('buttons.access')}</a>
          </AntMenu.Item>
          <AntMenu.Item>
            <Link to={`/section/${this.props.section.get('id')}/catalog/${this.props.currentCatalog.get('id')}/edit`}>{trs('buttons.configureCatalog')}</Link>
          </AntMenu.Item>
          <AntMenu.Item>
            <a rel="noopener noreferrer" onClick={this.remove}>{trs('buttons.removeCatalog')}</a>
          </AntMenu.Item>
        </AntMenu>
      );
    }
    return (
      <Row type="flex" justify="space-between" align="middle" className={styles.header}>
        <h2 className={styles.catalogName}>{currentCatalog && currentCatalog.get('name')}</h2>
        <Dropdown
          overlay={menu}
          trigger={['click']}
          placement="bottomRight"
        >
          <ButtonTransparent className={styles.icon}><Icon type="setting-10" /></ButtonTransparent>
        </Dropdown>
      </Row >
    )
  }
}

export default Header;
