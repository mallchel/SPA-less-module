import React from 'react'
// import routes from '../../../../routes'
import TabsMenu from '../../../common/menu/TabsMenu'
import routes from '../../../../routes'
import styles from './headerSection.less'

const Menu = function ({ sections }) {
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

export default Menu;
