import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import { Radio } from 'antd'
import styles from './fields.less'

import InputFocusMixin from '../../../../../../../../../mixins/InputFocusMixin'
import recordActions from '../../../../../../../../../../actions/recordActions'

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

  onChangeItem(e) {
    const itemId = e.target.value;
    this.setState({
      value: itemId
    });
    this.props.onSave(itemId);
    this.props.onUpdate(itemId);
    recordActions.clearErrorField(this.props.catalogId, this.props.recordId, this.props.fieldId);
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.value != nextProps.value) {
      let newValue = nextProps.value;
      this.setState({
        value: newValue
      });
    }
  },

  render() {
    return (
      <RadioGroup
        onChange={this.onChangeItem}
      >
        {
          this.props.config.get('items').map((item, key) => {
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
