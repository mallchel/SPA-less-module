import React, { Component } from 'react'
import { Menu as AntMenu, Dropdown, Icon } from 'antd';
import NavLink from '../../../router/Link'
import ButtonTransparent from '../../../elements/ButtonTransparent'
import { Link } from 'react-router-dom'
import cn from 'classnames'

import styles from './OverlayDropdown.less'

class OverlayDropdown extends Component {
  state = {
    visible: false,
    textSearch: ''
  };

  search = (e) => {
    this.setState({
      textSearch: e.target.value
    })
  }
  componentDidMount() {
  }
  handleVisibleChange = (flag) => {
    this.setState({ visible: flag });
  }
  hidden = () => {
    console.log(this.visible)
    this.setState({ visible: false });
  }
  render() {
    const { textSearch } = this.state;
    const filterData = textSearch
      ? this.props.items.filter(item => {
        return item.get('name').toLowerCase().indexOf(textSearch) !== -1
      })
      : this.props.items;

    const { props: { vertical } } = this;
    const menu = (
      <AntMenu
        className={cn(this.props.vertical.menu, styles.menu)}
      >
        <AntMenu.Item
          className={styles.itemSearch}
        >
          <input
            type="search"
            className={styles.input}
            placeholder='поиск'
            onChange={this.search}
            onClick={e => e.stopPropagation()}
          />
        </AntMenu.Item>
        {
          filterData.map(item => {
            return (
              <NavLink key={item.get('id')} route={item.get('route') || this.props.route} params={{ [this.props.params]: item.get('id') }} render={props => {
                return (
                  <li className={cn(vertical.item, { [vertical.selected]: props.isActive })}>
                    <Link to={props.link} className={cn(styles.link, vertical.link)}>
                      {
                        item.get('icon') ? <Icon type={`icon ${item.get('icon')}`} className={cn(vertical.icon)} /> : null
                      }
                      <div className={vertical.text}>{item.get('name')}</div>
                    </Link>
                  </li>
                )
              }} />
            )
          })
        }
      </AntMenu>
    );

    return (
      <Dropdown
        overlay={menu}
        placement="bottomRight"
        trigger={['click']}
      >
        <ButtonTransparent>...</ButtonTransparent>
      </Dropdown>
    );
  }
}

export default OverlayDropdown;
