import _ from 'lodash';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import DefaultViewer from './viewers/default.jsx';

import ImageViewer from './viewers/image.jsx';
import AudioViewer from './viewers/audio.jsx';

const allViewers = [
  // audio files
  ImageViewer,
  AudioViewer
];

const FileViewer = React.createClass({

  propTypes: {
    files: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number
      ]),
      size: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number
      ]),
      mimeType: React.PropTypes.string,
      title: React.PropTypes.string,
      url: React.PropTypes.string
    }))
  },

  render() {
    let files = this.props.files;

    let filesByViewer = [];
    let fileViewers = [];

    allViewers.forEach((Viewer, idx) => {
      filesByViewer[idx] = files.filter((file) => !(file.loading || file.error) && file.mimeType && Viewer.isMyFile(file));
      fileViewers.push((
        <Viewer key={idx} {...this.props} files={filesByViewer[idx]} allFiles={files}/>
      ));
    });
    filesByViewer = _.flatten(filesByViewer);
    let restFiles = files.filter((file) => filesByViewer.indexOf(file) == -1);

    fileViewers.push(<DefaultViewer key={'default'} {...this.props} files={restFiles} allFiles={files}/>);

    return (
      <div>{fileViewers}</div>
    );
  }
});

export default FileViewer;
