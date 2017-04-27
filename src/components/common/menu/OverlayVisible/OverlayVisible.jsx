import React, { Component } from 'react'
import { Menu as AntMenu, Dropdown, Icon } from 'antd';
import NavLink from '../../router/Link'
import { Link } from 'react-router-dom'
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
    const menu = (
      <AntMenu
        className={`ant-menu-inline ${styles.verticalMenu}`}
      >
        <AntMenu.Item
          style={{padding: '0', backgroundColor: 'white'}}
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
                    className={this.props.classItemVertical
                      ? (props.isActive
                        ? `${this.props.classItemVertical} ${this.props.classSelected}`
                        : this.props.classItemVertical)
                      : (props.isActive
                        ? `${this.props.classItem} ${this.props.classSelected}`
                        : this.props.classItem)
                    }>
                    <Link to={props.link}>
                      {
                        this.props.icon ? <Icon type={item.icon} /> : null
                      }
                      {item.name}
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
        onVisibleChange={this.handleVisibleChange}
        visible={this.state.visible}
        placement="bottomRight"
        trigger={['click']}
      >
        <a href="">...</a>
      </Dropdown>
    );
  }
}

export default OverlayVisible;
