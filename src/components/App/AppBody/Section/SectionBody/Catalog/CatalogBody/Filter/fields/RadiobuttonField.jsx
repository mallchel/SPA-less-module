import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

const RadiobuttonField = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    value: React.PropTypes.string.isRequired,
    config: React.PropTypes.object,
    onSave: React.PropTypes.func.isRequired
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
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value
    });
  },

  render() {
    return (
      <div className="record-radio">
        { this.props.config.get('items').map((item)=> {
            return (
              <label key={item.get('id')} className="radio record-radio__item">
                <input
                    className="checkbox record-radio__input"
                    type="radio"
                    checked={this.state.value === item.get('id')}
                    onChange={_.bind(this.onChangeItem, this, item.get('id'))} />
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
