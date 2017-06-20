import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Immutable from 'immutable'
import tinycolor from 'tinycolor2'
import _ from 'lodash'
import { Tag } from 'antd'
import recordActions from '../../../../../../../../../../actions/recordActions'

import styles from './fields.less'

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
    return (
      <div>
        {this.props.config.get('items').map((item) => {
          const id = item.get('id');
          const selected = this.state.values.get(id);
          const backgroundColor = '#' + item.get('color');
          const color = tinycolor(backgroundColor).darken(65).toString();
          return (
            <Tag
              key={id}
              onClick={_.bind(this.onClickItem, this, id)}
              style={selected && !this.props.readOnly ? { backgroundColor: backgroundColor, border: '1px solid rgba(0,0,0,0.1)', color: color } : { backgroundColor: 'transparent' }}
              className={styles.tags}
            >
              {item.get('name')}
            </Tag>
          );
        })}
      </div>
    );
  }
});

export default DropdownField;
