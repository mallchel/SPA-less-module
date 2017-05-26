import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import BaseFileField from '../../../../../../../../../../common/dataTypes/FileField'

const FileField = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    value: React.PropTypes.object.isRequired,
    config: React.PropTypes.object.isRequired
  },

  render() {
    return (
      <BaseFileField value={this.props.value} config={this.props.config} inContainers={true} />
    );
  }
});

export default FileField;
