import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Immutable from 'immutable'
import classNames from 'classnames'
import _ from 'lodash'
import recordActions from '../../../../../../../../../../actions/recordActions'

function getValuesMap(values) {
  let map = {};
  (values || []).forEach((v) => {
    map[v] = true;
  });
  return Immutable.fromJS(map);
}

const DropdownField = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    value: React.PropTypes.object,
    config: React.PropTypes.object,
    onSave: React.PropTypes.func.isRequired,
    onUpdate: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      values: getValuesMap(this.props.value)
    };
  },

  onClickItem(itemId) {
    if (this.props.readOnly) {
      return;
    }

    let newValues = this.props.config.get('multiselect') ? this.state.values : Immutable.fromJS({});

    newValues = newValues.set(itemId, !this.state.values.get(itemId));

    this.setState({
      values: newValues
    });

    let values = [];
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
    let classes = classNames({
      'record-dropdown': true,
      'record-dropdown--readonly': this.props.readOnly
    });
    return (
      <div className={classes}>
        {this.props.config.get('items').map((item) => {
          let id = item.get('id');
          let selected = this.state.values.get(id);
          return (
            <span
              key={id}
              onClick={_.bind(this.onClickItem, this, id)}
              className={'record-dropdown__item' + (selected ? ' record-dropdown__item--selected' : '')}
              style={{ backgroundColor: '#' + item.get('color') }}>
              {item.get('name')}
            </span>
          );
        })}
      </div>
    );
  }
});

export default DropdownField;
