import React, { Component } from 'react'
import { Menu as AntMenu, Dropdown, Icon } from 'antd'
import PropTypes from 'prop-types'
import ButtonTransparent from '../../../../../../../../common/elements/ButtonTransparent'
import trs from '../../../../../../../../../getTranslations'
import apiActions from '../../../../../../../../../actions/apiActions'
import modalsActions from '../../../../../../../../../actions/modalsActions'
import { confirm } from '../../../../../../../../common/Modal'
import getLink from '../../../../../../../../common/router/getLink'
import routes from '../../../../../../../../../routes'

import PRIVILEGE_CODES from '../../../../../../../../../configs/privilegeCodes'
import RESOURCE_TYPES from '../../../../../../../../../configs/resourceTypes'
import { checkAccessOnObject } from '../../../../../../../../../utils/rights'

class ViewActivities extends Component {
  static propTypes = {
    view: PropTypes.object
  }

  onClickAccess = (history, location, e) => {
    const view = this.props.view;

    if (view) {
      let isAccessView = view && checkAccessOnObject(RESOURCE_TYPES.VIEW, view, PRIVILEGE_CODES.ACCESS);
      let readOnly = !checkAccessOnObject(RESOURCE_TYPES.CATALOG, this.props.catalog, PRIVILEGE_CODES.ACCESS) && !isAccessView;
      modalsActions.openViewAccessModal(view, readOnly, (result) => {
        if (result && result.viewId) {
          const link = getLink(location, routes.view, { viewId: result.viewId });
          history.push(link);
        }
      });
    }
  }

  renameView = (e) => {
    let view = this.props.view;
    const catalogId = view.get('catalogId');
    modalsActions.openViewInputModalEdit(view, catalogId);
  }

  // remove view.
  openRemoveConfirm = (e) => {
    const view = this.props.view;
    const viewId = view.get('id');
    const catalogId = view.get('catalogId');

    confirm({
      headerText: trs('modals.removeViewConfirm.headerText'),
      text: view.get('forRights') ? trs('modals.removeViewConfirm.textForRights') : trs('modals.removeViewConfirm.text'),
      okText: trs('modals.removeViewConfirm.okText'),
      cancelText: trs('modals.removeViewConfirm.cancelText'),
      onOk() {
        apiActions.deleteView({
          catalogId: catalogId,
          viewId: viewId
        });
      }
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

      // if ((!view.get('isNew') && Number(view.get('id')) !== 0) && (isAccessAdmin || isPrivateView)) {
      if (isAccessAdmin || isPrivateView) {
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
                <a rel="noopener noreferrer" onClick={() => item.onClick(this.props.history, this.props.location)}>{item.text}</a>
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
        <ButtonTransparent className={this.props.className}><Icon type="icon setting-10" /></ButtonTransparent>
      </Dropdown>
    )
  }
}

export default ViewActivities;
