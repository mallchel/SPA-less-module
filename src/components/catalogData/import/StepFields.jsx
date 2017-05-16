import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Immutable from 'immutable';
import trs from '../../../getTranslations';
import apiActions from '../../../actions/apiActions';
import Loading from '../../common/Loading';
import StepFieldsDropArea from './StepFieldsDropArea';
import StepFieldsItem from './StepFieldsItem';

const log = require('debug')('CRM:Component:catalogData:StepFields');

function matchFields(catalogFields, fileFields) {
  let fileFieldMatches = [];
  let catalogFieldMatches = [];

  fileFields.forEach(()=> fileFieldMatches.push(null));

  catalogFields.forEach((t, ti)=> {
    catalogFieldMatches[ti] = null;
    let idx = fileFields.indexOf(t.get('name'));

    if ( idx !== -1 && catalogFieldMatches[idx] == null ) {
      catalogFieldMatches[ti] = idx;
      fileFieldMatches[idx] = t.get('id');
    }
  });
  log('matchFields', fileFieldMatches, catalogFieldMatches);
  return [Immutable.fromJS(fileFieldMatches), Immutable.fromJS(catalogFieldMatches)];
}

function getStateByProps(props) {
  let file = props.appState.getIn(['uploadingFiles', props.fileId]);
  let catalogFields = file && file.get('catalogFields');
  let fileFields = file && file.get('fileFields');


  if ( file && fileFields && catalogFields ) {
    let [fileFieldMatches, catalogFieldMatches] = matchFields(catalogFields, fileFields);
    return {
      catalogFields,
      fileFields,
      fileFieldMatches,
      catalogFieldMatches,
      loading: false
    };
  } else {
    return {
      catalogFields: null,
      fileFields: null,
      fileFieldMatches: null,
      catalogFieldMatches: null,
      loading: true
    };
  }

}

const StepFields = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    appState: React.PropTypes.object.isRequired,
    catalogId: React.PropTypes.string.isRequired,
    onImportDone: React.PropTypes.func.isRequired,
    changeStep: React.PropTypes.func.isRequired,
    fileId: React.PropTypes.string.isRequired
  },

  getInitialState() {
    return getStateByProps(this.props);
  },

  componentDidMount() {
    if ( !this.state.catalogFields ) {
      apiActions.getCatalogFields({catalogId: this.props.catalogId});
    }
  },

  componentWillReceiveProps(nextProps) {
    if ( this.state.loading ) {
      this.setState(getStateByProps(nextProps));
    }
  },

  onDropField(catalogColIndex, fileColIndex) {
    this.setState({
      fileFieldMatches: this.state.fileFieldMatches.set(fileColIndex, this.state.catalogFields.getIn([catalogColIndex, 'id'])),
      catalogFieldMatches: this.state.catalogFieldMatches.set(catalogColIndex, fileColIndex)
    });
  },

  onRemoveCatalogCol(catalogColIndex) {
    this.setState({
      fileFieldMatches: this.state.fileFieldMatches.set(this.state.catalogFieldMatches.get(catalogColIndex), null),
      catalogFieldMatches: this.state.catalogFieldMatches.set(catalogColIndex, null)
    });
  },

  onClickCancel() {
    this.props.closeModal();
  },

  onClickNext() {
    let fileColIndexesByCatalogColId = {};
    this.state.catalogFields.forEach((t, ti)=> {
      if ( this.state.catalogFieldMatches.get(ti) != null ) {
        fileColIndexesByCatalogColId[t.get('id')] = this.state.catalogFieldMatches.get(ti);
      }
    });
    this.props.changeStep(2, this.props.fileId, fileColIndexesByCatalogColId);
  },

  render() {

    if ( this.state.loading ) {
      return (
        <div className="modal-import__step">
          <Loading fullHeight={true} />
      </div>
      );
    } else {

      return (
        <div className="modal-import__step">
          <div className="modal-import__step-content import-fields">
            <div className="import-fields__col">
              <div className="import-fields__arrow icon icon--interface-6" />
              <div className="import-fields__col-name">{trs('import.fields.fileFields')}</div>
              {this.state.fileFields && this.state.fileFields.map((fColName, i)=> {
                return (
                  <StepFieldsDropArea disabled={true} key={i}>
                    <StepFieldsItem
                        fileColIndex={i}
                        name={fColName}
                        disabled={this.state.fileFieldMatches.get(i) != null}
                        canDrag={this.state.fileFieldMatches.get(i) == null}
                        canRemove={false} />
                  </StepFieldsDropArea>
                );
              })}
            </div>

            <div className="import-fields__col">
              <div className="import-fields__col-name">{trs('import.fields.catalogFields')}</div>
              {this.state.catalogFields && this.state.catalogFields.map((tCol, i)=> {
                return (
                  <StepFieldsDropArea catalogColIndex={i} disabled={this.state.catalogFieldMatches.get(i) != null} key={i} onDropField={this.onDropField}>
                    { this.state.catalogFieldMatches.get(i) != null ?
                          <StepFieldsItem
                              name={this.state.fileFields.get(this.state.catalogFieldMatches.get(i))}
                              canRemove={true}
                              catalogColIndex={i}
                              onRemoveCatalogCol={this.onRemoveCatalogCol}
                              canDrag={false} /> :
                          null }
                  </StepFieldsDropArea>
                );
              })}
            </div>

            <div className="import-fields__col">
              <div className="import-fields__col-name">&nbsp;</div>
              {this.state.catalogFields && this.state.catalogFields.map((tCol, i)=> {
                return (
                  <StepFieldsDropArea disabled={true} key={i}>
                    <StepFieldsItem index={i} canDrag={false} name={tCol.get('name')} />
                  </StepFieldsDropArea>
                );
              })}
            </div>
          </div>
          <footer className="modal-import__step-footer modal-window__footer">
            <button className="btn" onClick={this.onClickNext}>{trs('buttons.next')}</button>
            <a className="m-like-button" href="javascript:void(0)" onClick={this.onClickCancel}>{trs('buttons.cancel')}</a>
          </footer>
        </div>
      );
    }
  }

});

export default StepFields;
