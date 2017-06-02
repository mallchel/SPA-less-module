import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import trs from '../../../getTranslations';

const ChangeCheckboxes = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    change: React.PropTypes.object.isRequired,
    isNewRecord: React.PropTypes.bool
  },

  render() {
    let itemsById = {};
    this.props.config.get('items').forEach((item) => {
      itemsById[item.get('id')] = item.get('name');
    });
    let oldValues = this.props.change.get('oldValue').map((item) => {
      let isInNewValues = this.props.change.get('newValue').find((testItem) => { return item == testItem; });
      if (isInNewValues) {
        return null;
      }
      return itemsById[item] || trs('record.history.unknown');
    });
    let newValues = this.props.change.get('newValue').map((item) => {
      let isInOldValues = this.props.change.get('oldValue').find((testItem) => { return item == testItem; });
      if (isInOldValues) {
        return null;
      }
      return itemsById[item] || trs('record.history.unknown');
    });
    return (
      <div className="history__item-content-radio">
        {oldValues.map((item, i) => {
          if (!item) {
            return null;
          }
          return (
            <label key={i} className="checkbox record-radio__item removed">
              <input className="checkbox record-radio__input" type="checkbox" readOnly={true} checked="" />
              {item}
            </label>
          );
        })}
        {newValues.map((item, i) => {
          if (!item) {
            return null;
          }
          return (
          <label key={i} className="checkbox record-radio__item record-radio__item--selected">
            <input className="checkbox record-radio__input" type="checkbox" readOnly={true} checked="checked" />
            {item}
          </label>
          );
        })}
      </div>
    );
  }

});

export default ChangeCheckboxes;
