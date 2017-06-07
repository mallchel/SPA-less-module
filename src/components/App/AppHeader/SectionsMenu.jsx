import React, { Component } from 'react'
import TabsMenu from '../../common/menu/TabsMenu'
import DefaultRedirect from '../../common/router/DefaultRedirect'
import routes from '../../../routes'
import apiActions from '../../../actions/apiActions'
import { connect } from '../../StateProvider'

import styles from './appHeader.less'

class SectionsMenu extends Component {
  componentDidMount() {
    apiActions.getSections();
  }
  render() {
    const hasAdd = false;
    const sections = this.props.sections.valueSeq().sortBy(s => s.get('name').toLowerCase()).map(s => s.remove('icon'));

    return (
      <div>
        <DefaultRedirect route={routes.section} params='sectionId' object={sections.get(0)} />
        <TabsMenu
          route={routes.section}
          params='sectionId'
          items={sections}
          buttons={[hasAdd && { text: '', icon: '', onClick() { } }]}
          className={`${styles.shiftLeft} ${styles.menu}`}
          dragType='section'
          canDrag={false}
          onDragEnd={()=>console.log('oggo')}
        />
      </div>
    )
  }
}

export default connect(SectionsMenu, ['sections']);
