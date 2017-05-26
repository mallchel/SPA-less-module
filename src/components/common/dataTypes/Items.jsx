import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import _ from 'lodash'

const Items = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    values: React.PropTypes.oneOfType([
      React.PropTypes.array,
      ImmutablePropTypes.list
    ]).isRequired,
    inContainers: React.PropTypes.bool,
    onClick: React.PropTypes.func
  },

  onClick(e) {
    e.stopPropagation();
  },

  render() {
    return (
      <div className={'items-field' + (this.props.inContainers ? ' items-field--containers' : '')}>
        {this.props.values.length === 0 ? null : this.props.values.map((val, i)=> {
          if ( this.props.inContainers ) {
            return (
              <div key={i} className={"items-field__item" + (val.disabled ? ' items-field__item-disabled' : '') }>
                <span className="items-field__text" style={{backgroundColor: val.color ? '#' + val.color : null}}>
                  {val.icon ? <span className={'icon icon--' + val.icon} /> : null }
                  {this.props.onClick && !val.disabled ? <a href="javascript:void(0)" onClick={_.bind(this.props.onClick, this, val)}>{val.name}</a> : val.name}
                </span>
                <span className="items-field__dots">...</span>
              </div>
            );
          } else if (val.href) {
            return <a key={i} onClick={this.onClick} href={val.href} target="_blank">{val.name}</a>;
          } else if (this.props.fieldType === 'checkboxes') {
            return <span key={i}>
                    <span className="icon icon--status-10" />
                    <span className="checkbox-value">{val.name}</span>
                  </span>;
          } else {
            return <span key={i} className="items-field__file">{val.icon ? <span className={'icon icon--' + val.icon} /> : null }{this.props.onClick && !val.disabled ? <a href="javascript:void(0)" onClick={_.bind(this.props.onClick, this, val)}>{val.name}</a> : val.name}</span>;
          }
        })}
      </div>
    );
  }
});

export default Items;
