import React, { Component } from 'react'
import { Menu as AntMenu, Dropdown, Icon } from 'antd';
import NavLink from '../../router/Link'
import { Link } from 'react-router-dom'
import ButtonTransparent from '../../elements/ButtonTransparent'
import cn from 'classnames'
import styles from './overlayVisible.less'

class OverlayVisible extends Component {
  state = {
    visible: false,
    filterData: this.props.items
  };
  search = (e) => {
    let queryResult = [];
    this.props.items.forEach(function (element) {
      if (element.name.toLowerCase().indexOf(e.target.value) !== -1) {
        queryResult.push(element);
      }
    });
    this.setState({
      filterData: queryResult
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
    let { props: { vertical } } = this;
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
          this.state.filterData.map(item => {
            return (
              <NavLink key={item.id} route={this.props.route} params={{ [this.props.params]: item.id }} component={(props) => {
                return (
                  <li
                    className={cn(vertical.item, { [vertical.selected]: props.isActive })}>
                    <Link to={props.link} className={cn(styles.link, vertical.link)}>
                      {
                        item.icon ? <Icon type={item.icon} className={cn(vertical.icon)} /> : null
                      }
                      <span className={vertical.text}>{item.name}</span>
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

export default OverlayVisible;
