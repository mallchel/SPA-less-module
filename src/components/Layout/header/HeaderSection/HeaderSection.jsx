import React, { Component } from 'react'
import { Menu as AntMenu, Icon, Dropdown, Row, Col } from 'antd'
import routes from '../../../../routes'
import TabsMenu from '../../../common/menu/TabsMenu'
import ButtonTransparent from '../../../common/elements/ButtonTransparent'
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

const sections = [
  {
    id: 1,
    name: 'Продажи'
  },
  {
    id: 2,
    name: 'Лицензии'
  },
  {
    id: 3,
    name: 'Разработка'
  },
  {
    id: 4,
    name: 'Бухгалтерия'
  },
  {
    id: 5,
    name: 'Задачи'
  },
  {
    id: 6,
    name: 'Управление'
  },
  {
    id: 7,
    name: 'Продажи1'
  },
  {
    id: 8,
    name: 'Лицензии1'
  },
  {
    id: 9,
    name: 'Разработка1'
  },
  {
    id: 10,
    name: 'Бухгалтерия1'
  },
  {
    id: 11,
    name: 'Задачи1'
  },
  {
    id: 12,
    name: 'Управление1'
  },
  {
    id: 13,
    name: 'Продажи2'
  },
  {
    id: 14,
    name: 'Лицензии2'
  },
  {
    id: 15,
    name: 'Разработка2'
  },
  {
    id: 16,
    name: 'Бухгалтерия2'
  },
  {
    id: 17,
    name: 'Задачи2'
  },
  {
    id: 18,
    name: 'Управление2'
  }
];


class HeaderSection extends Component {
  render() {
    return (
      <Row type="flex" justify="space-between" align="middle" className={styles.container}>
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
            className={`${styles.shiftLeft} ${styles.menu}`}
          />
        </Col>

        <Col>
          <Row type="flex" justify="space-around" align="middle" className={styles.profile}>
            <img src="favicon.ico" alt="profile" className={styles.img} />
            <ButtonTransparent><Icon type="interface-13" /></ButtonTransparent>
          </Row>
        </Col>
      </Row>
    )
  }
}

export default HeaderSection;
