import React, { Component } from 'react'
import { Menu as AntMenu, Dropdown, Button } from 'antd'
import PropTypes from 'prop-types'
import trs from '../../../../../../../../getTranslations'
import NavLink from '../../../../../../../common/router/Link'
import routes from '../../../../../../../../routes'

import PRIVILEGE_CODES from '../../../../../../../../configs/privilegeCodes'
import RESOURCE_TYPES from '../../../../../../../../configs/resourceTypes'
import { checkAccessOnObject } from '../../../../../../../../utils/rights'

class RecordActivities extends Component {
  static PropTypes = {
    record: PropTypes.object,
    catalog: PropTypes.object,
    viewId: PropTypes.string,
    hasBeenEdit: PropTypes.bool,
    onClone: PropTypes.func,
    onRemove: PropTypes.func,
    onClickCreate: PropTypes.func,
    onClickAccess: PropTypes.func,
    onSave: PropTypes.func
  }
  render() {
    let dropDownButtonItems = [];
    let createButton;
    const record = this.props.record;
    const isNew = record.get('isNew');
    const catalog = this.props.catalog;
    const view = catalog.getIn(['views', this.props.viewId]);

    if (isNew) {
      if (record.get('creating')) {
        createButton = {
          disabled: true,
          type: 'primary',
          text: trs('buttons.creating'),
          new: true
        };
      } else {
        const isAccessCreate = checkAccessOnObject(RESOURCE_TYPES.VIEW,
          view, PRIVILEGE_CODES.CREATE);
        const isAccessCreateAtCatalog = checkAccessOnObject(RESOURCE_TYPES.CATALOG,
          catalog, PRIVILEGE_CODES.CREATE);

        if (isAccessCreate || isAccessCreateAtCatalog) {
          createButton = {
            type: 'primary',
            text: trs('buttons.create'),
            onClick: this.props.onClickCreate,
            disabled: !!record.getIn(['updateProcesses', 'count']) || record.getIn(['updateProcesses', 'should']),
            new: true
          };
        }
      }
    } else {
      createButton = {
        type: 'default',
        text: trs('buttons.access'),
        onClick: this.props.onClickAccess
      };

      const isAccessCreateAtCatalog = checkAccessOnObject(RESOURCE_TYPES.CATALOG,
        catalog, PRIVILEGE_CODES.CREATE);

      if (isAccessCreateAtCatalog) {
        dropDownButtonItems.push({
          text: trs('buttons.clone'),
          onClick: this.props.onClone
        });
      }

      // check access on delete record.
      const isAccessDel = checkAccessOnObject(RESOURCE_TYPES.RECORD, record, PRIVILEGE_CODES.DELETE);
      isAccessDel && dropDownButtonItems.push({
        text: trs('buttons.remove'),
        onClick: this.props.onRemove
      });

      if (this.props.hasBeenEdit) {
        // check access on edit record.
        createButton = {
          type: 'primary',
          text: trs('buttons.save'),
          onClick: this.props.onSave,
          disabled: record.get('saving') || !!record.getIn(['updateProcesses', 'count']) || record.getIn(['updateProcesses', 'should'])
        };
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
      createButton ?
        <NavLink route={routes.records} render={({ link, history }) => {
          return (
            createButton.new
              ?
              <Button disabled={createButton.disabled} type={createButton.type} onClick={() => createButton.onClick({ history, link })} overlay={dropdownMenu}>
                {createButton.text}
              </Button>
              :
              <Dropdown.Button disabled={createButton.disabled} type={createButton.type} onClick={() => createButton.onClick({ history, link })} overlay={dropdownMenu}>
                {createButton.text}
              </Dropdown.Button>
          )
        }} />
        : null
    )
    {/*<Dropdown.Button disabled={createButton.disabled} type={createButton.type} onClick={createButton.onClick} overlay={dropdownMenu}>
          {createButton.text}
        </Dropdown.Button>*/}
  }
}

export default RecordActivities;
