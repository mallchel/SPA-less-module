import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import cn from 'classnames'
import { Link } from 'react-router-dom'
import trs from '../../../../../../../../getTranslations'
import modalsActions from '../../../../../../../../actions/modalsActions'
import DropDownButton from '../../../../../../../common/DropdownButton'
import NavLink from '../../../../../../../common/router/Link'
import routes from '../../../../../../../../routes'

import PRIVILEGE_CODES from '../../../../../../../../configs/privilegeCodes'
import RESOURCE_TYPES from '../../../../../../../../configs/resourceTypes'
import { checkAccessOnObject } from '../../../../../../../../utils/rights'


const ViewsItem = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    view: React.PropTypes.object,
    currentCatalog: React.PropTypes.object,
    currentCatalogId: React.PropTypes.string,
    onClick: React.PropTypes.func.isRequired,
    selected: React.PropTypes.bool
  },

  onSelectItem() {
    let id = this.props.view.get('id');
    this.props.onClick(id);
  },

  onModalNewView() {
    // implement:
    let accessOnViewForRights = checkAccessOnObject(RESOURCE_TYPES.CATALOG,
      this.props.currentCatalog,
      PRIVILEGE_CODES.ACCESS);
    modalsActions.openViewInputModal(this.props.currentCatalogId, accessOnViewForRights);
  },


  render() {
    let name = this.props.view.get('originName')
      ? this.props.view.get('originName')
      : this.props.view.get('name');
    let isNew = this.props.view.get('isNew');

    return (
      <NavLink route={routes.view} params={{ viewId: this.props.view.get('id') }} render={props => {
        return (
          <li className={cn('ant-menu-item', { 'ant-menu-item-selected': props.isActive })}>
            <Link to={props.link}>
              {
                isNew ?
                  trs('views.newView')
                  : name
              }
            </Link>
          </li>
        )
      }} />
    )
  }
  // {
  //   isNew ?
  //     trs('views.newView')
  //     /*<DropDownButton items={[]} onClick={this.onModalNewView} text={trs('buttons.save')} />*/
  //     : name
  // }
});

export default ViewsItem;
