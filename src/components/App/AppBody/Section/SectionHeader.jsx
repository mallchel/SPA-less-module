import React from 'react'
// import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Menu as AntMenu, Dropdown, Icon } from 'antd'
import PropTypes from 'prop-types'
import modalsActions from '../../../../actions/modalsActions'
import apiActions from '../../../../actions/apiActions'
import trs from '../../../../getTranslations'
import InputModal from '../../../common/InputModal'
import { base, confirm, prompt } from '../../../common/Modal'
import ButtonTransparent from '../../../common/elements/ButtonTransparent'

import PRIVILEGE_CODES from '../../../../configs/privilegeCodes'
import RESOURCE_TYPES from '../../../../configs/resourceTypes'
import { checkAccessOnObject } from '../../../../utils/rights'

import styles from './section.less'

const log = require('debug')('CRM:Component:Sidebar:ButtonAfterCatalogs');

const SettingSection = React.createClass({
  // mixins: [PureRenderMixin],
  propTypes: {
    section: PropTypes.object,
    isAccessAdmin: PropTypes.bool.isRequired
  },

  onClickAccess() {
    let sectionId = this.props.section.get('id');
    if (sectionId) {
      let isAdmin = checkAccessOnObject(RESOURCE_TYPES.SECTION, this.props.section, PRIVILEGE_CODES.ADMIN);
      let readOnly = !checkAccessOnObject(RESOURCE_TYPES.SECTION, this.props.section, PRIVILEGE_CODES.ACCESS);
      let object = { sectionId };
      modalsActions.openAccessModal({ object }, RESOURCE_TYPES.SECTION, { readOnly, isAdmin }, true);
    }
  },

  openRenameModal() {
    prompt({
      headerText: trs('modals.changeSectionName.headerText'),
      value: this.props.section.get('name'),
      onOk: this.onRename,
      okText: trs('buttons.save'),
      cancelText: trs('buttons.cancel')
    });
  },

  onRename(newName) {
    apiActions.updateSection({
      sectionId: this.props.section.get('id')
    }, {
        name: newName
      });
  },

  openRemoveConfirm() {
    confirm({
      onOk: this.onOk,
      onCancel: this.onCancel,
      headerText: trs('modals.removeSectionConfirm.headerText'),
      text: trs('modals.removeSectionConfirm.text'),
      okText: trs('modals.removeSectionConfirm.okText'),
      cancelText: trs('modals.removeSectionConfirm.cancelText'),
    })
  },

  onOk() {
    log('remove section');
    apiActions.deleteSection({
      sectionId: this.props.section.get('id')
    });
  },
  onCancel() {
    log('cancel remove');
  },

  render() {
    let menu = {};

    if (this.props.isAccessAdmin) {
      menu = (
        <AntMenu>
          <AntMenu.Item>
            <a rel="noopener noreferrer" onClick={this.onClickAccess}>{trs('buttons.access')}</a>
          </AntMenu.Item>
          <AntMenu.Item>
            <a rel="noopener noreferrer" onClick={this.openRenameModal}>{trs('buttons.rename')}</a>
          </AntMenu.Item>
          <AntMenu.Item>
            <a rel="noopener noreferrer" onClick={this.openRemoveConfirm}>{trs('buttons.removeSection')}</a>
          </AntMenu.Item>
        </AntMenu>
      );
    }

    return (
      <div>
        <span>{this.props.section && this.props.section.get('name')}</span>
        <Dropdown
          overlay={menu}
          trigger={['click']}
          disabled={!this.props.isAccessAdmin ? true : false}
        >
          <ButtonTransparent className={styles.shiftRight}><Icon type="icon setting-10" /></ButtonTransparent>
        </Dropdown>
      </div>
    );
  }
})

export default SettingSection;
