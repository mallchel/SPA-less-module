import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Immutable from 'immutable';

import FileField from '../../common/dataTypes/FileField';

const ChangeFile = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    change: React.PropTypes.object.isRequired,
    isNewRecord: React.PropTypes.bool
  },

  render() {

    let mixedList = {};

    let oldFiles = this.props.change.get('oldValue');
    let newFiles = this.props.change.get('newValue');

    let newFilesList = newFiles.filter((file) => {
      return !oldFiles.find((testFile) => file.get('id') == testFile.get('id'));
    }).map((value, i) => {
      return (
        <li key={i}>
          <FileField config={this.props.config} value={Immutable.List([value])} />
        </li>
      );
    });

    let oldFilesList = oldFiles.filter((file) => {
      return !newFiles.find((testFile) => file.get('id') == testFile.get('id'));
    }).map((value, i) => {
      return (
        <li className="removed" key={i}>
          <FileField config={this.props.config} value={Immutable.List([value])} removed={true} />
        </li>
      );
    });

    return (
      <ul className="object-list">
        {newFilesList}
        {oldFilesList}
      </ul>
    );
  }

});

export default ChangeFile;
