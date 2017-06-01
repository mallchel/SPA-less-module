import React, { Component } from 'react'
import HandleBar from './HandleBar'
import { Row } from 'antd'
import ReactDOM from 'react-dom'

class SplitterPane extends Component {
  state = {
    width: 50
  }

  handleMouseDown = (e) => {
    if (e.button === 2) {
      return;
    }

    this.isDragging = true;
    this.initialRectSplitter = ReactDOM.findDOMNode(this.splitterPanel).getBoundingClientRect();
    this.parentNode = ReactDOM.findDOMNode(this.splitterPanel).parentNode.getBoundingClientRect();

    let clientX;

    if (e.type === 'mousedown') {
      clientX = e.clientX;
    } else if (e.type === 'touchstart') {
      clientX = e.touches[0].clientX;
    }

    this.clientX = clientX;

    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('touchmove', this.handleMouseMove);
    document.body.classList.add('no-select');
  }

  componentDidMount = () => {
    document.addEventListener('mouseup', this.handleMouseUp, true);
    document.addEventListener('touchend', this.handleMouseUp, true);
  }

  handleMouseMove = (e) => {
    if (!this.isDragging) {
      return;
    }

    let movingX;

    if (e.type === 'mousemove') {
      movingX = e.clientX;
    } else if (e.type === 'touchmove') {
      movingX = e.touches[0].clientX;
    }

    let deltaX = this.clientX - movingX;
    let width = deltaX + this.initialRectSplitter.width;
    width = width / this.parentNode.width * 100; // Value in percantage

    this.setState({
      width
    });
  }

  handleMouseUp = (e) => {
    if (!this.isDragging) {
      return;
    }

    this.isDragging = false;

    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('touchmove', this.handleMouseMove);
    document.body.classList.remove('no-select');
  }

  render() {
    const { width } = this.state;
    return (
      <Row type="flex" style={{ width: width + '%', minWidth: '30%', overflow: "hidden" }} ref={node => this.splitterPanel = node}>
        <HandleBar
          handleMouseDown={this.handleMouseDown}
        />
        {this.props.children}
      </Row>
    )
  }
}

export default SplitterPane;
