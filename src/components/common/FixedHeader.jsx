import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import $ from 'jquery'
import is from '../../utils/is'

const isIE10 = is.ie(10);

const FixedHeader = React.createClass({
  mixins: [PureRenderMixin],
  getInitialState() {
    return {
      right: null,
      bg: ''
    };
  },

  setRight() {
    if (this.refs.node) {
      let node = ReactDOM.findDOMNode(this.refs.node).parentNode;
      this.setState({
        //right: !isIE10 ? node.offsetWidth - node.clientWidth + 'px' : null
        right: '0'
      });
    }
  },

  componentDidUpdate(prevProps, prevState) {
    this.setRight();
  },

  componentDidMount() {
    this.setRight();
    setTimeout(this.setRight);

    $(window).on('resize', this.setRight);
    let node = ReactDOM.findDOMNode(this.refs.node);
    $(node.parentNode).on('scroll', this.setRight);
    this.setState({
      bg: $(node).parents('.content__column').css('backgroundColor')
    });
  },

  componentWillUnmount() {
    $(window).off('resize', this.setRight);
    $(ReactDOM.findDOMNode(this.refs.node).parentNode).off('scroll', this.setRight);
  },

  render() {
    // log('render', this.props.className);

    return (
      <header ref="node" style={{
        right: this.state.right || '',
        left: this.state.left || '',
        width: this.state.width || '',
        backgroundColor: this.state.bg
      }}
        className={classNames('header', 'header--extra', this.props.className || '', { 'header--fixed': this.state.right !== null, 'header--ie10': isIE10 })}>
        <div className="header__data">
          {this.props.children}
        </div>

        {this.props.additionHeader}

      </header>
    );
  }

});

export default FixedHeader;
