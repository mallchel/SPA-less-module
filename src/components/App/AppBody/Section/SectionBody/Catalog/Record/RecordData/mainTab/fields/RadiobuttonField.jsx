import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import _ from 'lodash'

import InputFocusMixin from '../../../../../../../../../mixins/InputFocusMixin'
import recordActions from '../../../../../../../../../../actions/recordActions'

const RadiobuttonField = React.createClass({
  mixins: [
    PureRenderMixin,
    InputFocusMixin(function () {
      return (this.refs.inputFirst)? ReactDOM.findDOMNode(this.refs.inputFirst): null
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
      <div className="record-radio">
        { this.props.config.get('items').map((item, key)=> {
            let ref = (key)?'input':'inputFirst';
            let itemClasses = classNames('radio record-radio__item', {
              'record-radio__item--disabled': this.props.readOnly
            });

            return (
              <label key={item.get('id')} className={itemClasses}>
                <input
                    ref={ref}
                    className="radio record-radio__input"
                    type="radio"
                    checked={this.state.value === item.get('id')}
                    onChange={_.bind(this.onChangeItem, this, item.get('id'))}
                    disabled={this.props.readOnly} />
                <span className="record-radio__text">{item.get('name')}</span>
              </label>
            );
          })
        }
      </div>
    );
  }
});

export default RadiobuttonField;
