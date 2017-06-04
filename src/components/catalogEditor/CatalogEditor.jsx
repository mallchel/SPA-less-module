import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import FieldListEditor from './FieldListEditor'
import CatalogEditorHeader from './CatalogEditorHeader'
import Loading from '../common/Loading'
import apiActions from '../../actions/apiActions'
import { connect } from '../StateProvider'
import CatalogFactory from '../../models/CatalogFactory'

const CatalogEditor = React.createClass({
  mixins: [PureRenderMixin],

  componentWillMount() {
    const catalogId = this.props.match.params.catalogId;
    const sectionId = this.props.match.params.sectionId;

    catalogId && apiActions.getCatalog({
      catalogId: catalogId
    });

    if (!this.props.editingCatalogs.get(sectionId) && catalogId) {
      this.props.editingCatalogs.set(sectionId, this.props.catalogs.get(catalogId));
    } else if (!this.props.editingCatalogs.get(sectionId) && !catalogId) {
      const catalog = CatalogFactory.create({
        isNew: true,
        icon: 'content-11'
      });
      this.props.editingCatalogs.set(sectionId, catalog);
    }
  },

  componentWillReceiveProps(nextProps) {
    const newCatalogId = nextProps.match.params.catalogId;
    const newSectionId = nextProps.match.params.sectionId;

    if (!nextProps.editingCatalogs.get(newSectionId) && newCatalogId) {
      nextProps.editingCatalogs.set(newSectionId, nextProps.catalogs.get(newCatalogId));
    } else if (!nextProps.editingCatalogs.get(newSectionId) && !newCatalogId) {
      const catalog = CatalogFactory.create({
        isNew: true,
        icon: 'content-11'
      });
      nextProps.editingCatalogs.set(newSectionId, catalog);
    }
    if (newCatalogId && newCatalogId !== this.props.match.params.catalogId) {
      apiActions.getCatalog({
        catalogId: newCatalogId
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
