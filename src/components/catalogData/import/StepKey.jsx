import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Immutable from 'immutable';
import _ from 'lodash'
import apiActions from '../../../actions/apiActions';
import trs from '../../../getTranslations';
import Dropdown from '../../common/Dropdown';
import Loading from '../../common/Loading';

const log = require('debug')('CRM:Component:catalogData:StepKey');

function getStateByProps(props) {
  let items = [];
  let file = props.appState.getIn(['uploadingFiles', props.fileId]);
  let catalogFields = file && file.get('catalogFields');

  _.forEach(props.fieldMatches || {}, (index, colId)=> {
    let col = catalogFields.find((col)=> col.get('id') === colId);
    if ( col ) {
      items.push({
        key: colId,
        text: col.get('name')
      });
    }
  });
  return {
    file,
    items
  };
}

const StepKey = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    appState: React.PropTypes.object.isRequired,
    catalogId: React.PropTypes.string.isRequired,
    onImportDone: React.PropTypes.func.isRequired,
    changeStep: React.PropTypes.func.isRequired,
    fileId: React.PropTypes.string,
    fieldMatches: React.PropTypes.object
  },

  getInitialState() {
    let st = getStateByProps(this.props);
    st.keyId = null;
    return st;
  },

  onSelectKey(items) {
    log('select key', items[0]);
  },

  onClickCancel() {
    this.props.closeModal();
  },

  onClickImport() {
    // this.props.onImportDone(this.props.fileId, this.props.fieldMatches, this.state.keyId);
    apiActions.importFile({
      catalogId: this.props.catalogId,
      fileId: this.props.fileId,
      fieldMatches: this.props.fieldMatches,
      keyId: this.state.keyId
    });
  },

  componentWillReceiveProps(nextProps) {
    if ( !Immutable.is(nextProps.appState.getIn(['uploadingFiles', this.props.fileId]), this.props.appState.getIn(['uploadingFiles', this.props.fileId])) ) {
      this.setState(getStateByProps(nextProps));
    }
  },

  render() {

    let importing = this.state.file.get('importing'),
      importError = this.state.file.get('importError'),
      imported = this.state.file.get('imported');

    return (
      <div className="modal-import__step">
        <div className="modal-import__step-content import-key">
          { importing || importError || imported ?
              <Loading
                  fullHeight={true}
                  text={trs('import.key.importing')}
                  success={imported ? trs('import.key.done') : null}
                  error={importError ? trs('import.key.error') : null} /> :
              <div>
                <p>{trs('import.key.text1')}</p>
                <p>{trs('import.key.text2')}</p>
                <div className="import-key__control">
                  <span className="import-key__label">{trs('import.key.keyLabel')}</span>
                  <Dropdown items={this.state.items} withButton={true} onSelectItems={this.onSelectKey} />
                </div>
              </div> }
        </div>
        <footer className="modal-import__step-footer modal-window__footer">
          <button style={{display: imported || importError ? 'none' : null}} className="btn" onClick={this.onClickImport} disabled={importing || importError || imported}>
            { importing ?
                trs('import.key.importing') :
                trs('import.key.importButton.text') + ' ' + trs('import.key.importButton.recordsCount', this.state.file.get('recordsCount'))}
          </button>

          <a style={{display: importing || importError || imported ? 'none' : null}} className="m-like-button" href="javascript:void(0)" onClick={this.onClickCancel}>
            {trs('buttons.cancel')}
          </a>

          <button style={{display: imported || importError ? null : 'none'}} className="btn" onClick={this.onClickCancel} >
            {trs('import.key.close')}
          </button>
        </footer>
      </div>
    );
  }

});

export default StepKey;
