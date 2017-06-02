import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

const ChangeRadiobutton = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    change: React.PropTypes.object.isRequired,
    config: React.PropTypes.object.isRequired,
    isNewRecord: React.PropTypes.bool
  },

  render() {
    let itemsById = {};
    this.props.config.get('items').forEach((item) => {
      itemsById[item.get('id')] = item.get('name');
    });

    let oldValue = null;
    let newValue = null;
    if (itemsById[this.props.change.get('oldValue')]) {
      oldValue = (
        <label className="radio record-radio__item removed">
          <input className="radio record-radio__input" type="radio" readOnly={true} checked=""/>
          {itemsById[this.props.change.get('oldValue')]}
        </label>
      );
    }
    if (itemsById[this.props.change.get('newValue')]) {
      newValue = (
        <label className="radio record-radio__item">
          <input className="radio record-radio__input" type="radio" readOnly={true} checked="checked"/>
          {itemsById[this.props.change.get('newValue')]}
        </label>
      );
    }

    return (
      <div className="history__item-content-radio">
          {oldValue}
          {newValue}
      </div>
    );
  }

});

export default ChangeRadiobutton;
