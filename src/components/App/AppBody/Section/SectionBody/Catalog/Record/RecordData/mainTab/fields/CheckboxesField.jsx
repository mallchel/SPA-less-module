import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import ReactDOM from 'react-dom'
import Immutable from 'immutable'
import classNames from 'classnames'
import _ from 'lodash'

import InputFocusMixin from '../../../../../../../../../mixins/InputFocusMixin'
import recordActions from '../../../../../../../../../../actions/recordActions'

function getValuesMap(values) {
  var map = {};
  (values || []).forEach((v) => {
    map[v] = true;
  });
  return Immutable.fromJS(map);
}

const CheckboxesField = React.createClass({
  mixins: [
    PureRenderMixin,
    InputFocusMixin(function () {
      return (this.refs.inputFirst) ? ReactDOM.findDOMNode(this.refs.inputFirst) : null
    })
  ],
  propTypes: {
    value: React.PropTypes.object,
    config: React.PropTypes.object,
    onSave: React.PropTypes.func.isRequired,
    onUpdate: React.PropTypes.func.isRequired,
    readOnly: React.PropTypes.bool
  },

  getInitialState() {
    return {
      values: getValuesMap(this.props.value)
    };
  },

  onChangeItem(itemId) {
    var newValues = this.state.values.set(itemId, !this.state.values.get(itemId));
    this.setState({
      values: newValues
    });

    var values = [];
    newValues.forEach((v, id) => {
      if (v) {
        values.push(id);
      }
    });

    this.props.onSave(values);
    this.props.onUpdate(values);
    recordActions.clearErrorField(this.props.catalogId, this.props.recordId, this.props.fieldId);
  },

  componentWillReceiveProps(nextProps) {
    if (!Immutable.is(nextProps.value, this.props.value)) {
      this.setState({
        values: getValuesMap(nextProps.value)
      });
    }
  },

  render() {
    return (
      <div className="record-radio">
        {this.props.config.get('items').map((item, key) => {
          var id = item.get('id');
          var ref = (key) ? 'input' : 'inputFirst';
          var selected = this.state.values.get(id);
          let itemClasses = classNames('checkbox record-radio__item', {
            'record-radio__item--selected': selected,
            'record-radio__item--disabled': this.props.readOnly
          });

          return (
            <label
              key={id}
              className={itemClasses}
              style={{ backgroundColor: '#' + item.get('color') }}>
              <input
                ref={ref}
                className="checkbox record-radio__input"
                type="checkbox"
                checked={selected}
                onChange={_.bind(this.onChangeItem, this, id)}
                disabled={this.props.readOnly}
              />
              <span>{item.get('name')}</span>
            </label>
          );
        })}
      </div>
    );
  }
});

export default CheckboxesField;
