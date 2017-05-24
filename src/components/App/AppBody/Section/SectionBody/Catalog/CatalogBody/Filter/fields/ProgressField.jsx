import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Immutable from 'immutable'
import Slider from 'rc-slider'

const MIN = 0;
const MAX = 100;

const ProgressRangeField = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    value: React.PropTypes.object,
    config: React.PropTypes.object,
    onSave: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      value: this.getPropsValue()
    }
  },

  componentWillReceiveProps(nextProps) {
    this.setState({value: this.getPropsValue(nextProps)});
  },

  onChange(value) {
    this.setState({value});
  },

  onSave() {
    const [min, max] = this.state.value;

    this.props.onSave(this.props.fieldId, {
      at: min,
      to: max
    });
  },

  getPropsValue(props = this.props) {
    const v = Immutable.fromJS(props.value || {}).toJS();
    return [
      v.at || MIN,
      v.to || MAX
    ];
  },

  render() {
    const {value} = this.state;
    const [min, max] = value;

    return (
      <div className="progress-range">
        <div className="progress-range__number progress-range__number--min">{min}</div>
        <Slider range
          className="progress-range__slider"
          min={MIN}
          max={MAX}
          step={1}
          value={value}
          onChange={this.onChange}
          onAfterChange={this.onSave}
        />
        <div className="progress-range__number progress-range__number--max">{max}</div>
      </div>
    );
  }
});

export default ProgressRangeField;
