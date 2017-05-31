import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import trs from '../../../../../../../../../getTranslations'

import PRIVILEGE_CODES from '../../../../../../../../../configs/privilegeCodes'
import RESOURCE_TYPES from '../../../../../../../../../configs/resourceTypes'
import { checkAccessOnObject } from '../../../../../../../../../utils/rights'

const LinkedCatalogHeader = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    catalog: React.PropTypes.object.isRequired,
    onClickHeader: React.PropTypes.func
  },

  toggleList() {
    this.props.onClickHeader();
  },
  onClickCreate(e) {
    e.preventDefault();
    this.props.onClickCreate();
    e.stopPropagation();
  },

  render() {
    let isAccessCreate = checkAccessOnObject(RESOURCE_TYPES.CATALOG, this.props.catalog, PRIVILEGE_CODES.CREATE);
    return (
      <thead>

        <tr onClick={this.toggleList}>
          <th colSpan={2} className="linked-catalog__header linked-catalog__record-index">
            <span className="linked-catalog__header-title">
              <span className={'icon icon--' + this.props.catalog.get('icon')} />
              {this.props.catalog.get('title')}
            </span>
          </th>
          <th className="linked-catalog__header linked-catalog__header-add-button linked-catalog__header-date" colSpan="1">
            {!this.props.isNewRecord && isAccessCreate ?
              <span className="linked-catalog__header-add">
                <button type="button" className="btn btn--default btn--small" onClick={this.onClickCreate}>
                  <span className="icon icon--interface-72" />
                  {trs('record.linkedData.create')}
                </button>
              </span>
              :
              null}
          </th>
        </tr>

      </thead>
    );
  }

});

export default LinkedCatalogHeader;
