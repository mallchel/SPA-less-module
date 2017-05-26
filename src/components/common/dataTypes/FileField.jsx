import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Items from './Items';

import {API_PREFIX} from '../../../configs/reccords';

function makeLinkOnFile(file) {
  return API_PREFIX + 'files/' + file.id;
}

const FileField = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    value: React.PropTypes.object.isRequired,
    config: React.PropTypes.object,
    inContainers: React.PropTypes.bool,
    removed: React.PropTypes.bool,
  },

  onClickItem(item, e) {
    e.preventDefault();
    e.stopPropagation();
    if (!this.props.removed) {
      window.open(makeLinkOnFile(item.obj.toJS()));
    }
  },

  render() {
    return (
      <Items inContainers={this.props.inContainers} onClick={this.onClickItem} values={this.props.value.map((f)=> {
        return {
          obj: f,
          name: f.get('title'),
          icon: 'files-13',
          disabled: this.props.removed
        };
      }).toArray()} />
    );
  }
});

export default FileField;
