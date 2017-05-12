import React, { Component } from 'react'
import { Menu as AntMenu, Icon, Dropdown, Row, Col, Button } from 'antd'
import cn from 'classnames'
import routes from '../../../../routes'
import TabsMenu from '../../../common/menu/TabsMenu'
import ButtonTransparent from '../../../common/elements/ButtonTransparent'
import apiActions from '../../../../actions/apiActions'
import DefaultRedirect from '../../../common/router/DefaultRedirect'

import styles from './headerSection.less'

const menu = (
  <AntMenu>
    <AntMenu.Item>
      <a target="_blank" rel="noopener noreferrer" href="">1st menu item</a>
    </AntMenu.Item>
    <AntMenu.Item>
      <a target="_blank" rel="noopener noreferrer" href="">2nd menu item</a>
    </AntMenu.Item>
  </AntMenu>
);

class HeaderSection extends Component {
  componentDidMount() {
    // our init app-point...
    apiActions.getSections();
    apiActions.getCompanyInfo(window.location.host.split('.')[0]);
  }

  render() {
    const sections = this.props.appState.get('sections').sortBy(s => s.get('name').toLowerCase()).valueSeq().map(s => s.remove('icon'));
    const module = this.props.appState.get('extensions').valueSeq();
    const hasAdd = false;
    console.log(module.toJS())

    return (
      <Row type="flex" justify="space-between" align="middle" className={styles.container}>
        <DefaultRedirect route={routes.section} object={sections.get(0)} />

        <Col>
          <Row type="flex" align="middle" className={styles.logo}>
            <Dropdown
              overlay={menu}
              trigger={['click']}
            >
              <ButtonTransparent {...this.props}><Icon type="content-43" /></ButtonTransparent>
            </Dropdown>
            <img src="logo.png" alt="favicon" />
          </Row>
        </Col>

        <Col className={styles.menuContainer}>
          <TabsMenu
            params='sectionId'
            route={routes.section}
            items={sections}
            buttons={[hasAdd && { text: '', icon: '', onClick() { } }]}
            className={`${styles.shiftLeft} ${styles.menu}`}
          />
        </Col>


        <Col>
          <Row type="flex" justify="space-around" align="middle" className={styles.profile}>
            {
              module.map(module => {
                {/*let isSelected = this.state.selectedModuleCode && this.state.selectedModuleCode === module.get('code');*/ }
                return (
                  <Button
                    className={cn('some-active')} key={module.get('code')}
                  //onClick={this.onClickModule.bind(this, module.get('code'))}
                  >
                    <Icon type={module.get('icon')} />
                    <span>{module.get('title')}</span>
                  </Button>
                )
              })
            }
            <img src="favicon.ico" alt="profile" className={styles.img} />
            <ButtonTransparent><Icon type="interface-13" /></ButtonTransparent>
          </Row>
        </Col>
      </Row>
    )
  }
}

export default HeaderSection;
