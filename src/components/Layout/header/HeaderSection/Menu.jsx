import React from 'react'
// import routes from '../../../../routes'
import TabsMenu from '../../../common/menu/TabsMenu'
import styles from './headerSection.less'

const Menu = function ({ ...props }) {
  const sections = props.appState.get('sections').sortBy(s => s.get('name').toLowerCase()).valueSeq().map(s => s.remove('icon'));
  const hasAdd = false;

  return (
    <TabsMenu
      route='section'
      items={sections}
      buttons={[hasAdd && { text: '', icon: '', onClick() { } }]}
      className={`${styles.shiftLeft} ${styles.menu}`}
    />
  )
}

export default Menu;
