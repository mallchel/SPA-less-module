import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import FieldListEditor from './FieldListEditor'
import Loading from '../common/Loading'
// import apiActions from '../../actions/apiActions'
import { connect } from '../StateProvider'
// import catalogActions from '../../actions/catalogActions'

import styles from './catalogEditor.less'

const CatalogEditorBody = React.createClass({
  mixins: [PureRenderMixin],

  // componentWillMount() {
  //   const catalogId = this.props.match.params.catalogId;
  //   const sectionId = this.props.match.params.sectionId;

  //   if (this.props.isStateEditCatalog) {
  //     apiActions.getCatalog({
  //       catalogId: catalogId
  //     });
  //   } else {
  //     catalogActions.addCatalog({
  //       sectionId: sectionId
  //     });
  //   }
  // },

  // componentWillReceiveProps(nextProps) {
  //   const newCatalogId = nextProps.match.params.catalogId;
  //   const newSectionId = nextProps.match.params.sectionId;

  //   if (this.props.isStateEditCatalog && newCatalogId && newCatalogId !== this.props.match.params.catalogId) {
  //     apiActions.getCatalog({
  //       catalogId: newCatalogId
  //     });
  //   }
  //   if (this.props.isStateAddCatalog && newSectionId !== this.props.match.params.sectionId) {
  //     catalogActions.addCatalog({
  //       sectionId: newSectionId
  //     });
  //   }
  // },

  render() {
    const sectionId = this.props.match.params.sectionId;
    const catalog = this.props.catalog;
    const catalogs = this.props.catalogs;
    const dropType = this.props.dropType;
    const dropInfo = this.props.dropInfo;
    const disabled = this.props.disabled;

    return (
      <div className={styles.container}>
        <div>
          {catalog ?
            <FieldListEditor
              disabled={disabled}
              dropType={dropType}
              dropInfo={dropInfo}
              catalog={catalog}
              sectionId={sectionId}
              catalogs={catalogs}
            /> :
            null
          }
        </div>

        {!catalog ? <Loading fullHeight={true} /> : null}
      </div>
    );
  }

});

export default CatalogEditorBody;
// export default CatalogEditorBody;
