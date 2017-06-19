import React, { Component } from 'react'
import cn from 'classnames'
import { MemoryRouter } from 'react-router'
import { Route, Link } from 'react-router-dom'
import _ from 'lodash'
import ButtonClose from './elements/ButtonClose'

import styles from './controls.less'

import { withRouter } from 'react-router'
const Div = withRouter(function ({ children }) { return <div>{children}</div> })

export default class LinkedItem extends Component {
  render() {
    const {
      item,
      disabled,
      className,
      titleOnRemove,
      onClick,
      onClickRemove,
      removable,
      href } = this.props;

    let Icon;

    if (typeof item.icon === 'object') {
      Icon = <span className={styles.linkItemIcon}>{item.icon}</span>;
    } else {
      Icon = <span className={cn('anticon-icon ' + item.icon, styles.linkItemIcon)} />;
    }

    return (
      <div className={cn(styles.linkItemRow, disabled ? styles.linkItemRowDisabled : '', className)}>
        {
          href ?
            <MemoryRouter>
              <Div>
                <Route path="/123" render={() => {
                  return <div>12321456987</div>
                }}>
                </Route>
                <Link to={href} className={styles.linkWrapper} _onClick={() => onClick(item)}>
                  {Icon}
                  <span className={styles.linkItemText}>{item.text}</span>
                </Link>
              </Div>
            </MemoryRouter>
            :
            onClick ?
              <div className={cn(styles.linkWrapper, styles.linkChooseWrapper)} onClick={() => onClick(event, item)}>
                {Icon}
                <span className={cn(styles.linkItemText, styles.linkChooseText)}>{item.text || ''}</span>
              </div>
              :
              <div className={styles.linkWrapper}>
                {Icon}
                <span className={styles.linkItemText}>{item.text || ''}</span>
              </div>
        }
        {
          removable && <ButtonClose
            onClick={() => onClickRemove(item.key)}
            small
            title={titleOnRemove}
          />
        }
      </div>
    );
  }
}
