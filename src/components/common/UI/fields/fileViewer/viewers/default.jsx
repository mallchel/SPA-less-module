import React from 'react'
import { Icon } from 'antd'
import cn from 'classnames'
import trs from '../../../../../../../../../../../../getTranslations'
import { If, Else } from '../../../../../.././../../../../../common/ifc'
// import ButtonClose from '../../../../../.././../../../../../common/elements/ButtonClose'
import LinkedItem from '../../../../../.././../../../../../common/LinkedItem'

import styles from '../../fields.less'

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
    let item = {};
    if (file.loading && !file.error) {
      item.icon = <img className={styles.gifLoader} src="/modules/crm/images/loader.gif" />
    } else {
      item.icon = 'icon ' + (file.error ? 'interface-54' : 'files-13');
    }
    item.text = file.title;
    item.subText = file.size && <span className={styles.viewerSize}>{file.loading ? toProgress(file) : toMb(file.size)}</span>;

    return (
      <div className={cn({ [styles.uploadError]: file.error })}
        title={file.title}>

        <LinkedItem
          key={item.key}
          removable={!this.props.readOnly}
          item={item}
          onClickRemoveUser={this.onClickRemoveUser}
          titleOnRemove={trs('record.fields.file.remove')}
          href={!(file.loading || file.error) ? file.url : null}
          onClickRemove={this.onRemove}
        />

      </div>
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
