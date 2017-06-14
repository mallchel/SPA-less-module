import React from 'react'
import ButtonTransparent from '../ButtonTransparent'

import styles from './buttonClose.less'

export default function ButtonClose(props) {
  let className;
  if (props.small) {
    className = styles.small;
  } else {
    className = styles.default;
  }
  return (
    <ButtonTransparent onClick={props.onClick} className={props.className}>
      <span className={className}>&#x2715;</span>
    </ButtonTransparent>
  )
}
