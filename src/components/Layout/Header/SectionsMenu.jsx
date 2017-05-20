import React from 'react'
import TabsMenu from '../../common/menu/TabsMenu'
import routes from '../../../routes'

import styles from './header.less'

const SectionsMenu = function ({ sections }) {
  const hasAdd = false;

  return (
    <TabsMenu
      route={routes.section}
      params='sectionId'
      items={sections}
      buttons={[hasAdd && { text: '', icon: '', onClick() { } }]}
      className={`${styles.shiftLeft} ${styles.menu}`}
    />
  )
}

export default SectionsMenu;
