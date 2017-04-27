import React, { Component } from 'react'
import { Menu as AntMenu, Icon, Dropdown, Row, Col, Input } from 'antd'
import routes from '../../../../routes'
import TabsMenu from '../../../common/menu/TabsMenu'
import ButtonTransparent from '../../../common/elements/ButtonTransparent'
import styles from './headerSection.less'

const Search = Input.Search;
const menu = (
  <AntMenu>
    <AntMenu.Item
    >
      <Search
        placeholder="input search text"
        onSearch={value => console.log('search', value)}
        onChange={e => console.log('change', e.target.value)}
        onClick={e => {
          console.log('click', e)
          e.preventDefault();
          e.stopPropagation();
        }}
      />
    </AntMenu.Item>
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
      <Row type="flex" justify="space-between" align="middle" className={`${styles.header}`}>
        <Col>
          <Row type="flex" align="middle">
              <Dropdown
                overlay={menu}
                trigger={['click']}
              >
                <ButtonTransparent className="shiftLeft" {...this.props}><Icon type="content-43" /></ButtonTransparent>
                </Dropdown>
              {/*<Dropdown
                overlay={menu}
                trigger={['click']}
              >
                <Button type="dashed" icon="content-43" size={'small'}/>
              </Dropdown>*/}
              <img src="logo.png" alt="favicon" />
          </Row>
        </Col>

        <Col>
          <TabsMenu
            params='sectionId'
            route={routes.section}
            items={sections}
          />
        </Col>

        <Col>
          <Row type="flex" justify="space-around" align="middle">
              <img src="favicon.ico" alt="profile" className={styles.img}/>
              <ButtonTransparent className="shiftRight"><Icon type="interface-13" /></ButtonTransparent>
          </Row>
        </Col>
      </Row>
    )
  }
}

export default HeaderSection;
