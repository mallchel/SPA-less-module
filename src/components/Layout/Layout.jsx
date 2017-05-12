import React, { Component } from 'react'
import cn from 'classnames';
import NavRoute from '../common/router/Route'
import routes from '../../routes'
import HeaderSection from './header/HeaderSection'
import Content from './content/Content'
import styles from './layout.less'

class Section extends Component {
  render() {
    const containerClassNames = cn(styles.section, {
      'no-select': this.props.appState.get('dragging')
    });

    return (
      <div className={containerClassNames}>
        <HeaderSection { ...this.props } />
        <NavRoute route={routes.section} render={props => (
          <Content {...this.props} {...props} />
        )} />
      </div>
    )
  }
}

export default Section;
