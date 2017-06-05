import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import FieldListEditor from './FieldListEditor'
import CatalogEditorHeader from './CatalogEditorHeader'
import Loading from '../common/Loading'
import apiActions from '../../actions/apiActions'
import { connect } from '../StateProvider'
import catalogActions from '../../actions/catalogActions'

const CatalogEditor = React.createClass({
  mixins: [PureRenderMixin],

  componentWillMount() {
    const catalogId = this.props.match.params.catalogId;
    const sectionId = this.props.match.params.sectionId;

    if (this.props.isStateEditCatalog) {
      apiActions.getCatalog({
        catalogId: catalogId
      });
    } else {
      catalogActions.addCatalog({
        sectionId: sectionId
      });
    }
  },

  componentWillReceiveProps(nextProps) {
    const newCatalogId = nextProps.match.params.catalogId;
    const newSectionId = nextProps.match.params.sectionId;

    if (this.props.isStateEditCatalog && newCatalogId && newCatalogId !== this.props.match.params.catalogId) {
      apiActions.getCatalog({
        catalogId: newCatalogId
      });
    }
    if (this.props.isStateAddCatalog && newSectionId !== this.props.match.params.sectionId) {
      catalogActions.addCatalog({
        sectionId: newSectionId
      });
    }
  },

  render() {
    let sectionId = this.props.match.params.sectionId;
    let catalog = this.props.editingCatalogs.get(sectionId);
    let catalogs = this.props.catalogs;
    let dropType = this.props.dropType;
    let dropInfo = this.props.dropInfo;
    let disabled = catalog && (catalog.get('updating') || catalog.get('creating'));
    console.log(this.props)
    return (
      <div className="catalog-editor">
        <div className="catalog-form" style={{ marginTop: !catalog ? '0px' : null }}>
          {catalog ?
            <CatalogEditorHeader
              disabled={disabled}
              catalog={catalog}
              sectionId={sectionId} /> :
            null
          }
          {catalog ?
            <FieldListEditor
              disabled={disabled}
              dropType={dropType}
              dropInfo={dropInfo}
              catalog={catalog}
              sectionId={sectionId}
              catalogs={catalogs} /> :
            null
          }
        </div>

        {!catalog ? <Loading fullHeight={true} /> : null}
      </div>
    );
  }

});

export default connect(CatalogEditor, ['editingCatalogs', 'catalogs', 'dropType', 'dropInfo']);
