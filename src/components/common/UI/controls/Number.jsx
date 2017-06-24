import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import TextInput from './common/TextInput'

import styles from './controls.less'

const Number = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    value: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string
    ]),
    config: React.PropTypes.object,
    onSave: React.PropTypes.func.isRequired,
    onUpdate: React.PropTypes.func.isRequired,
    disableDebounce: React.PropTypes.bool,
    readOnly: React.PropTypes.bool,
    error: React.PropTypes.string,
  },

  getInitialState() {
    return {
      value: this.props.value
    };
  },

  render() {
    const { updateProcess, value, readOnly, onUpdate, htmlId } = this.props;
    const unit = this.props.config.get('unit');

    return (
      <div>
        <TextInput
          id={htmlId}
          type="number"
          value={value}
          onSave={this.props.onSave}
          onUpdate={onUpdate}
          readOnly={readOnly}
          updateProcess={updateProcess}
          wrapperClassName={styles.numberWrapper}
          className={styles.numberInput}
        />
        {
          unit && <span className={styles.numberUnit}>{unit}</span>
        }
      </div>
    );
  }
});

export default Number;
