import React, { Component } from 'react'
import FieldTypes from '../../fieldTypes/FieldTypes'
import CatalogEditorBody from '../../catalogEditor/CatalogEditorBody'
import CatalogEditorHeader from '../../catalogEditor/CatalogEditorHeader'
import apiActions from '../../../actions/apiActions'
import catalogActions from '../../../actions/catalogActions'
// import { connect } from '../../StateProvider'

import styles from './appBody.less'

class CatalogEditor extends Component {
  componentDidMount() {
    const catalogId = this.props.match.params.catalogId;
    const sectionId = this.props.match.params.sectionId;

    if (this.props.isStateEditCatalog) {
      apiActions.getCatalog({
        catalogId: catalogId
      }, null, 'catalogEdit');

    } else {
      catalogActions.addCatalog({
        sectionId: sectionId
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const newCatalogId = nextProps.match.params.catalogId;
    const newSectionId = nextProps.match.params.sectionId;

    if (this.props.isStateEditCatalog && newCatalogId && newCatalogId !== this.props.match.params.catalogId) {
      apiActions.getCatalog({
        catalogId: newCatalogId
      }, null, 'catalogEdit');
    }
    if (this.props.isStateAddCatalog && newSectionId !== this.props.match.params.sectionId) {
      catalogActions.addCatalog({
        sectionId: newSectionId
      });
    }
  }

  render() {
    return (
      <div className={styles.catalogEditor} >
        <CatalogEditorHeader {...this.props} />
        <div className={styles.catalogEditorBody}>
          <FieldTypes />
          <CatalogEditorBody {...this.props} />
        </div>
      </div>
    )
  }
}

export default CatalogEditor;
