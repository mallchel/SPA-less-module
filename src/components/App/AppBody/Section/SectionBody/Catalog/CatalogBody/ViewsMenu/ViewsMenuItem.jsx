import React from 'react'
import cn from 'classnames'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom'
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

import styles from './viewsMenu.less'

const ViewsMenuItem = React.createClass({
  propTypes: {
    view: PropTypes.object,
    catalog: PropTypes.object
  },

  onModalNewView() {
    // implement:
    const accessOnViewForRights = checkAccessOnObject(RESOURCE_TYPES.CATALOG,
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
          <li className={cn(styles.menuItem)}>
            {
              isNew ? <StateRedirect route={routes.view} params={{ viewId: view.get('id') }} /> : null
            }
            <div className={cn('ant-menu-item', { 'ant-menu-item-selected': props.isActive }, styles.itemDiv)}>
              <Link to={props.link} className={styles.link}>
                {name}
              </Link>
            </div>
            {
              (!filtersChanged && props.isActive && !(Number(view.get('id')) === 0)) &&
              <Route render={props => {
                return <ViewActivities className={styles.viewsActivities} view={view} {...props} />
              }} />
            }
            {
              filtersChanged && <DropDownButton items={[]} onClick={this.onModalNewView} text={trs('buttons.save')} />
            }
          </li>
        )
      }} />
    )
  }
});

export default ViewsMenuItem;
