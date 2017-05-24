import React from 'react'
// import PureRenderMixin from 'react-addons-pure-render-mixin'
import cn from 'classnames'
import { Link } from 'react-router-dom'
import trs from '../../../../../../../../getTranslations'
import modalsActions from '../../../../../../../../actions/modalsActions'
import DropDownButton from '../../../../../../../common/DropdownButton'
import StateLink from '../../../../../../../common/router/StateLink'
import routes from '../../../../../../../../routes'
import StateRedirect from '../../../../../../../common/router/StateRedirect'

import PRIVILEGE_CODES from '../../../../../../../../configs/privilegeCodes'
import RESOURCE_TYPES from '../../../../../../../../configs/resourceTypes'
import { checkAccessOnObject } from '../../../../../../../../utils/rights'


const ViewsMenuItem = React.createClass({
  // mixins: [PureRenderMixin],
  propTypes: {
    view: React.PropTypes.object,
  },

  onModalNewView() {
    // implement:
    let accessOnViewForRights = checkAccessOnObject(RESOURCE_TYPES.CATALOG,
      this.props.currentCatalog,
      PRIVILEGE_CODES.ACCESS);
    modalsActions.openViewInputModal(this.props.currentCatalogId, accessOnViewForRights);
  },


  render() {
    const view = this.props.view;
    let name = view.get('originName')
      ? view.get('originName')
      : view.get('name');
    let filterChanged = view.get('filterChanged');
    const isNew = view.get('id') === '$new';

    return (
      <StateLink route={routes.view} params={{ viewId: this.props.view.get('id') }} render={props => {
        return (
          <li className={cn('ant-menu-item', { 'ant-menu-item-selected': props.isActive })}>
            {
              isNew ? <StateRedirect route={routes.view} params={{ viewId: this.props.view.get('id') }} /> : null
            }
            <Link to={props.link}>
              {name}
              {
                filterChanged && <DropDownButton items={[]} onClick={this.onModalNewView} text={trs('buttons.save')} />
              }
            </Link>
          </li>
        )
      }} />
    )
  }
});

export default ViewsMenuItem;
