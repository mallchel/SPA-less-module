import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Menu as AntMenu, Row, Dropdown, Icon } from 'antd'
import _ from 'lodash'
import ButtonTransparent from '../../../../../../common/elements/ButtonTransparent'
import { checkAccessOnObject } from '../../../../../../../utils/rights'
import PRIVILEGE_CODES from '../../../../../../../configs/privilegeCodes'
import RESOURCE_TYPES from '../../../../../../../configs/resourceTypes'
import trs from '../../../../../../../getTranslations'
import { confirm } from '../../../../../../common/Modal'
import apiActions from '../../../../../../../actions/apiActions'
import modalsActions from '../../../../../../../actions/modalsActions'

import styles from './catalogHeader.less'

class CatalogHeader extends Component {
  onClickAccess = (e) => {
    let catalog = this.props.catalog;
    let catalogId = catalog.get('id');
    if (catalogId) {
      let isAdmin = checkAccessOnObject(RESOURCE_TYPES.CATALOG, this.props.catalog, PRIVILEGE_CODES.ADMIN);
      let readOnly = !checkAccessOnObject(RESOURCE_TYPES.CATALOG, this.props.catalog, PRIVILEGE_CODES.ACCESS);
      let object = { catalogId };
      let parents = [{ sectionId: catalog.get('sectionId') }];
      modalsActions.openAccessModal({ object, parents }, RESOURCE_TYPES.CATALOG, { readOnly, isAdmin });
    }
  }

  remove = (history, sectionId) => {
    confirm({
      headerText: trs('modals.removeConfirm.headerText'),
      text: trs('modals.removeConfirm.text'),
      okText: trs('modals.removeConfirm.okText'),
      cancelText: trs('modals.removeConfirm.cancelText'),
      onOk: () => {
        apiActions.deleteCatalog({
          catalogId: this.props.catalog.get('id')
        }).then(() => {
          history.push(`/section/${sectionId}`);
        });
      }
    })
  }

  render() {
    let menu = {};
    const catalog = this.props.catalog;
    const isAccessAdmin = checkAccessOnObject(RESOURCE_TYPES.CATALOG, catalog, PRIVILEGE_CODES.ADMIN);
    const sectionId = this.props.match.params.sectionId;

    if (isAccessAdmin) {
      menu = (
        <AntMenu>
          <AntMenu.Item>
            <a rel="noopener noreferrer" onClick={this.onClickAccess}>{trs('buttons.access')}</a>
          </AntMenu.Item>
          <AntMenu.Item>
            <Link to={`/section/${catalog.get('sectionId')}/catalog/${catalog.get('id')}/edit`}>{trs('buttons.configureCatalog')}</Link>
          </AntMenu.Item>
          <AntMenu.Item>
            <a rel="noopener noreferrer" onClick={() => this.remove(this.props.history, sectionId)}>{trs('buttons.removeCatalog')}</a>
          </AntMenu.Item>
        </AntMenu>
      );
    }
    return (
      <Row type="flex" justify="space-between" align="middle" className={styles.container}>
        <h2 className={styles.catalogName}>{catalog && catalog.get('name')}</h2>
        {
          !_.isEmpty(menu)
            ?
            <Dropdown
              overlay={menu}
              trigger={['click']}
              placement="bottomRight"
            >
              <ButtonTransparent className={styles.icon}><Icon type="icon setting-10" /></ButtonTransparent>
            </Dropdown>
            :
            <Icon className={styles.disabledSetting} type="icon setting-10" />
        }
      </Row>
    )
  }
}

export default CatalogHeader;
