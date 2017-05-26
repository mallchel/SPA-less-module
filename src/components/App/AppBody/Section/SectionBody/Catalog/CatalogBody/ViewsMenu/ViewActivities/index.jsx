import React, { Component } from 'react'
import { Menu as AntMenu, Dropdown, Icon } from 'antd'
import PropTypes from 'prop-types'
import ButtonTransparent from '../../../../../../../../common/elements/ButtonTransparent'
import trs from '../../../../../../../../../getTranslations'
import apiActions from '../../../../../../../../../actions/apiActions'
import modalsActions from '../../../../../../../../../actions/modalsActions'
import { confirm } from '../../../../../../../../common/Modal'

import PRIVILEGE_CODES from '../../../../../../../../../configs/privilegeCodes'
import RESOURCE_TYPES from '../../../../../../../../../configs/resourceTypes'
import { checkAccessOnObject } from '../../../../../../../../../utils/rights'

import styles from './viewActivities.less'

class ViewActivities extends Component {
  static PropTypes = {
    view: PropTypes.object
  }

  onClickAccess = (e) => {
    const view = this.props.view;
    const viewId = view.get('id');

    if (viewId) {
      let isAccessView = view && checkAccessOnObject(RESOURCE_TYPES.VIEW, view, PRIVILEGE_CODES.ACCESS);
      let readOnly = !checkAccessOnObject(RESOURCE_TYPES.CATALOG, this.props.catalog, PRIVILEGE_CODES.ACCESS) && !isAccessView;
      modalsActions.openViewAccessModal(viewId, readOnly, (result) => {
        // if (result && result.viewId) {
        //   router.go('main.section.catalogData', { viewId: result.viewId });
        // }
      });
    }
  }

  renameView = (e) => {
    const view = this.props.view;
    const catalogId = view.get('catalogId');
    modalsActions.openViewInputModalEdit(view, catalogId);
  }

  // remove view.
  openRemoveConfirm = (e) => {
    const view = this.props.view;
    const viewId = view.get('id');
    const catalogId = view.get('catalogId');

    function onOk() {
      apiActions.deleteView({
        catalogId: catalogId,
        viewId: viewId
      });
    }

    confirm({
      title: trs('modals.removeViewConfirm.headerText'),
      contentText: view.get('forRights') ? trs('modals.removeViewConfirm.textForRights') : trs('modals.removeViewConfirm.text'),
      okText: trs('modals.removeViewConfirm.okText'),
      cancelText: trs('modals.removeViewConfirm.cancelText'),
      onOk
    });
  }
  render() {
    const view = this.props.view;
    let dropDownButtonItems = [];

    // access button if view for rights.
    if (view && view.get('forRights')) {
      dropDownButtonItems = [{
        text: trs('buttons.access'),
        onClick: this.onClickAccess
      }].concat(dropDownButtonItems);
    }

    // edit and remove
    if (view) {
      // check access admin on catalog.
      let isAccessAdmin = checkAccessOnObject(RESOURCE_TYPES.VIEW, view, PRIVILEGE_CODES.ACCESS);
      let isPrivateView = !view.get('forRights');

      if ((!view.get('isNew') && Number(view.get('id')) !== 0) && (isAccessAdmin || isPrivateView)) {
        dropDownButtonItems = [{
          text: trs('views.renameView'),
          onClick: this.renameView
        },
        {
          text: trs('buttons.removeView'),
          onClick: this.openRemoveConfirm
        }].concat(dropDownButtonItems);
      }
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
      <Dropdown
        overlay={dropdownMenu}
        trigger={['click']}
        placement="bottomRight"
      >
        <ButtonTransparent className={styles.button}><Icon type="setting-10" /></ButtonTransparent>
      </Dropdown>
    )
  }
}

export default ViewActivities;
