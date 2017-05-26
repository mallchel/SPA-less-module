import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

const NumberField = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    value: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string
    ]),
    config: React.PropTypes.object,
    withUnit: React.PropTypes.bool
  },

  render() {
    let units = null;
    if (this.props.withUnit) {
      units = (<span>&nbsp;{this.props.config.get('unit')}</span>);
    }
    if ( this.props.value == null ) {
      return <span>&nbsp;</span>;
    } else {
      return (
        <span>
          <span>{this.props.value.toString().replace('.', ',')}</span>{units}
        </span>
      );
    }
  }
});

export default NumberField;
