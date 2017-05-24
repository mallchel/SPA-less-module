import React, { Component } from 'react'
import TabsMenu from '../../common/menu/TabsMenu'
import routes from '../../../routes'
import apiActions from '../../../actions/apiActions'

import styles from './appHeader.less'

class SectionsMenu extends Component {
  componentDidMount() {
    apiActions.getSections();
  }
  render() {
    const hasAdd = false;
    const sections = this.props.appState.get('sections').sortBy(s => s.get('name').toLowerCase()).valueSeq().map(s => s.remove('icon'));

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
}

export default SectionsMenu;
