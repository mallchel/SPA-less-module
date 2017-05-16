import React from 'react'
// import routes from '../../../../routes'
import ListMenu from '../../../common/menu/ListMenu'
import styles from './headerCatalog.less'

const Menu = function ({ ...props }) {
  const sectionId = props.match.params.sectionId;
  const catalogs = props.appState.get('catalogs').valueSeq().filter(c => c.get('sectionId') === sectionId);

  return (
    <ListMenu
      route='catalog'
      items={catalogs}
      className={styles.shiftLeft}
    />
  )
}

export default Menu;
