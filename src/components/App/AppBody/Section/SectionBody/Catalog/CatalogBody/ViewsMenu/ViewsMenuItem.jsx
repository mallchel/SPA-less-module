import React from 'react'
import cn from 'classnames'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import trs from '../../../../../../../../getTranslations'
import modalsActions from '../../../../../../../../actions/modalsActions'
import DropDownButton from '../../../../../../../common/DropdownButton'
import StateLink from '../../../../../../../common/router/StateLink'
import routes from '../../../../../../../../routes'
import StateRedirect from '../../../../../../../common/router/StateRedirect'
import ViewActivities from './ViewActivities'

import PRIVILEGE_CODES from '../../../../../../../../configs/privilegeCodes'
import RESOURCE_TYPES from '../../../../../../../../configs/resourceTypes'
import { checkAccessOnObject } from '../../../../../../../../utils/rights'


const ViewsMenuItem = React.createClass({
  propTypes: {
    view: PropTypes.object,
    catalog: PropTypes.object
  },

  onModalNewView() {
    // implement:
    let accessOnViewForRights = checkAccessOnObject(RESOURCE_TYPES.CATALOG,
      this.props.catalog,
      PRIVILEGE_CODES.ACCESS);
    modalsActions.openViewInputModal(this.props.catalog.get('id'), accessOnViewForRights);
  },


  render() {
    const view = this.props.view;
    let name = view.get('originName')
      ? view.get('originName')
      : view.get('name');
    let filtersChanged = view.get('filtersChanged');
    const isNew = view.get('id') === '$new';

    return (
      <StateLink route={routes.view} params={{ viewId: view.get('id') }} render={props => {
        return (
          <li className={cn('ant-menu-item', { 'ant-menu-item-selected': props.isActive })}>
            {
              isNew ? <StateRedirect route={routes.view} params={{ viewId: view.get('id') }} /> : null
            }
            <Link to={props.link}>
              {name}
              {
                (!filtersChanged && props.isActive && !(Number(view.get('id')) === 0)) &&
                <ViewActivities view={view} />
              }
              {
                filtersChanged && <DropDownButton items={[]} onClick={this.onModalNewView} text={trs('buttons.save')} />
              }
            </Link>
          </li>
        )
      }} />
    )
  }
});

export default ViewsMenuItem;
