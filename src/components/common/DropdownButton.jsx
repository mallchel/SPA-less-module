import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ReactDOM from 'react-dom';
import DropdownButtonItem from './DropdownButtonItem';
import $ from 'jquery'

const DropdownButton = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    items: React.PropTypes.arrayOf(React.PropTypes.shape({
      text: React.PropTypes.string.isRequired,
      onClick: React.PropTypes.func.isRequired
    })).isRequired,
    type: React.PropTypes.string,
    onClick: React.PropTypes.func,
    text: React.PropTypes.string.isRequired,
    disabled: React.PropTypes.bool
  },

  getInitialState() {
    return {
      isOpen: false
    };
  },

  toggleList() {
    if ( this.props.disabled ) {
      return;
    }
    this.setState({
      isOpen: !this.state.isOpen
    });
  },

  onClickOutside(e) {
    // e.stopPropagation();
    let arrow = ReactDOM.findDOMNode(this.refs.arrow);
    if ( e.target !== arrow && e.target.parentNode !== arrow ) {
      this.setState({
        isOpen: false
      });
    }
  },

  componentDidUpdate(prevProps, prevState) {
    if ( this.state.isOpen && !prevState.isOpen ) {
      $('body').on('click', this.onClickOutside);
    } else if ( !this.state.isOpen && prevState.isOpen ) {
      $('body').off('click', this.onClickOutside);
    }
  },

  componentWillUnmount() {
    $('body').off('click', this.onClickOutside);
  },

  render() {

    let len = this.props.items.length;
    let items = this.props.items.map((item, i)=>
      <DropdownButtonItem key={i} isLast={i === len - 1} isFirst={i===0} onClick={item.onClick} text={item.text} disabled={item.disabled} />);

    return (
      <div className={'dropdown-group' + (items.length === 0 ? ' dropdown-group--empty' : '')}>
        <div className="button-action">
          <button
              disabled={this.props.disabled}
              title={this.props.text}
              onClick={this.props.onClick}
              className={'btn' + (this.props.type ? ' btn--' + this.props.type : '')}>
            {this.props.text}
          </button>
          <span ref="arrow" className="button-action--drop-down" onClick={this.toggleList}><i></i></span>
        </div>
        <ul className="button-action-list" style={{display: this.state.isOpen ? 'block' : 'none'}}>
          {items}
        </ul>
      </div>
    );
  }

});

export default DropdownButton;
