import React, { Component } from 'react'
import { Menu as AntMenu, Dropdown, Icon } from 'antd'
import PropTypes from 'prop-types'
import trs from '../../../../../../../../getTranslations'
import recordActions from '../../../../../../../../actions/recordActions'

import PRIVILEGE_CODES from '../../../../../../../../configs/privilegeCodes'
import RESOURCE_TYPES from '../../../../../../../../configs/resourceTypes'
import { checkAccessOnObject } from '../../../../../../../../utils/rights'


class RecordsActivities extends Component {
  static PropTypes = {
    catalog: PropTypes.object,
    viewId: PropTypes.string
  }
  btnExport() {
    const catalogId = this.props.catalog.get('id');
    const viewId = this.props.viewId;

    recordActions.requestForExportRecords(catalogId, { viewId });
  }

  btnAddRecord() {
    // router.go('main.section.catalogData.addRecord', {
    //   catalogId: this.props.catalog.get('id')
    // });
  }

  render() {
    const catalog = this.props.catalog;
    const viewId = this.props.viewId;
    const view = catalog && catalog.getIn(['views', viewId]);
    let createButton;
    let dropDownButtonItems = [];

    // export button for view
    const isAccessExportRecordAtView = view && checkAccessOnObject(RESOURCE_TYPES.VIEW,
      view, PRIVILEGE_CODES.EXPORT);

    const isAccessExportRecordAtCatalog = checkAccessOnObject(RESOURCE_TYPES.CATALOG,
      catalog, PRIVILEGE_CODES.EXPORT);

    if (isAccessExportRecordAtCatalog || isAccessExportRecordAtView) {
      dropDownButtonItems = [{
        text: trs('buttons.export'),
        onClick: this.btnExport
      }].concat(dropDownButtonItems);
    }


    // create record
    const isAccessCreateRecordAtView = view && checkAccessOnObject(RESOURCE_TYPES.VIEW,
      view, PRIVILEGE_CODES.CREATE);

    const isAccessCreateRecordAtCatalog = checkAccessOnObject(RESOURCE_TYPES.CATALOG,
      catalog, PRIVILEGE_CODES.CREATE);

    if (isAccessCreateRecordAtCatalog || isAccessCreateRecordAtView) {
      createButton = {
        text: trs('buttons.add'),
        onClick: this.btnAddRecord
      };
    }


    const dropdownMenu = (
      <AntMenu>
        {
          dropDownButtonItems.map((item, i) => {
            return (
              <AntMenu.Item key={i}>
                <a rel="noopener noreferrer" onClick={item.onClick}>{item.text}</a>
              </AntMenu.Item>
            )
          })
        }
      </AntMenu>
    );

    return (
      createButton ?
        <Dropdown.Button type="primary" onClick={createButton.onClick} overlay={dropdownMenu}>
          <Icon type="icon interface-72" />{createButton.text}
        </Dropdown.Button>
        : null
    )
  }
}

export default RecordsActivities;
