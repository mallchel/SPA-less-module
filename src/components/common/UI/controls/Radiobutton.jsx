import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import { Radio } from 'antd'
import InputFocusMixin from '../../../mixins/InputFocusMixin'
import SelectWithFilter from '../../../common/elements/SelectWithFilter'
import trs from '../../../../getTranslations'

import styles from './controls.less'

const RadioGroup = Radio.Group;
const RadiobuttonField = React.createClass({
  mixins: [
    PureRenderMixin,
    InputFocusMixin(function () {
      return (this.refs.inputFirst) ? ReactDOM.findDOMNode(this.refs.inputFirst) : null
    })
  ],
  propTypes: {
    value: React.PropTypes.string,
    config: React.PropTypes.object,
    onSave: React.PropTypes.func.isRequired,
    onUpdate: React.PropTypes.func.isRequired,
    readOnly: React.PropTypes.bool
  },

  getInitialState() {
    return {
      value: this.props.value
    };
  },

  onChangeItem(itemId) {
    this.setState({
      value: itemId
    });
    this.props.onSave(itemId);
    this.props.onUpdate(itemId);
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      let newValue = nextProps.value;
      this.setState({
        value: newValue
      });
    }
  },

  render() {
    const items = this.props.config.get('items');

    return (
      items.size >= 6 ?
        <SelectWithFilter
          mode="single"
          value={{
            key: this.props.value
          }}
          onChange={this.onChangeItem}
          placeholder={this.props.placeholder}
          notFoundContent={trs('dropdown.noitems')}
          items={items.map(item => {
            return {
              key: item.get('id'),
              text: item.get('name')
            }
          }).toJS()}
          className={styles.radioSelect}
          showSearch
        />
        :
        <RadioGroup
          onChange={(e) => this.onChangeItem(e.target.value)}
        >
          {
            items.map((item, key) => {
              let ref = (key) ? 'input' : 'inputFirst';
              const id = item.get('id');

              return (
                <Radio
                  key={id}
                  className={styles.radioItem}
                  ref={ref}
                  checked={this.state.value === id}
                  disabled={this.props.readOnly}
                  value={id}
                >
                  {item.get('name')}
                </Radio>
              );
            })
          }
        </RadioGroup>
    );
  }
});

export default RadiobuttonField;
