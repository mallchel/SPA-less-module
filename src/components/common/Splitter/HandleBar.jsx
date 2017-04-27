import React, { Component } from 'react'
import style from './handleBar.less'

class HandleBar extends Component {
  render() {
    const { handleMouseDown } = this.props;
    return (
      <div
        className={`${style.handleBar}`}
        onMouseDown={(e) => handleMouseDown(e)}
        onTouchStart={(e) => handleMouseDown(e)}
      >
        <span className={style.handleBar_drag} />
      </div>
    );
  }
}

export default HandleBar;
