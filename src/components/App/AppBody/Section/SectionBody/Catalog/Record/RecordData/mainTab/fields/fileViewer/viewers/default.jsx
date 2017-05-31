import React from 'react'
import trs from '../../../../../../../../../../../../getTranslations'
import { If, Else } from '../../../../../.././../../../../../common/ifc'

// in kbytes
function toMb(value) {
  var resVal = (Number(value) / 1000 / 1000).toFixed(1);
  if (resVal == '0.0')
    resVal = '0.1';
  return resVal + ' ' + trs('record.fields.file.size');
}

function toProgress(file) {
  if (isNaN(file.loading) || file.loading == 'NaN') {
    return '';
  }
  return parseInt(file.loading) + '%'
}

const FileRow = React.createClass({

  onRemove() {
    this.props.removeFn(this.props.file);
  },

  render() {
    let file = this.props.file;

    return (
      <span className={'file-viewer-default' + (file.error ? ' m-text_danger' : '')}
        title={file.title}>

        {(() => {
          if (file.loading && !file.error) {
            return <img src="/modules/crm/images/loader.gif" />
          } else {
            return <span className={'icon icon--' + (file.error ? 'interface-54' : 'files-13')} />
          }
        })()}


        <If condition={file.loading || file.error}>
          <span className="file-viewer-default__title--error">{file.title}</span>
          <Else>
            <a href={file.url} target="_blank">{file.title}</a>
          </Else>
        </If>

        <If condition={file.size}>
          <span className="file-viewer-default__size">{file.loading ? toProgress(file) : toMb(file.size)}</span>
        </If>

        <If condition={!this.props.readOnly}>
          <span title={trs('record.fields.file.remove')} className="m-close" onClick={this.onRemove} />
        </If>
      </span>
    );
  }
});

const DefaultViewer = React.createClass({
  render() {
    return (
      <div>
        {this.props.files.map((file, i) => {
          return (<div key={i} className="record-file__item"><FileRow {...this.props} file={file} /></div>);
        })}
      </div>
    );
  }
});

export default DefaultViewer;
