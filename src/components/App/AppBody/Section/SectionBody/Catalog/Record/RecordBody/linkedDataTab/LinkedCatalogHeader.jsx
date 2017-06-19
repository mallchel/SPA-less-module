import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Row, Icon, Button } from 'antd'
import trs from '../../../../../../../../../getTranslations'

import PRIVILEGE_CODES from '../../../../../../../../../configs/privilegeCodes'
import RESOURCE_TYPES from '../../../../../../../../../configs/resourceTypes'
import { checkAccessOnObject } from '../../../../../../../../../utils/rights'

import styles from './linkedData.less'

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
      <Row type="flex" justify="space-between" align="middle" onClick={this.toggleList} className={styles.sectionHeader}>
        <div>
          <Icon className={styles.headerIcon} type={'icon ' + this.props.catalog.get('icon')} />
          <span className={styles.headerText}>{this.props.catalog.get('title')}</span>
        </div>
        {
          !this.props.isNewRecord && isAccessCreate ?
            <Button onClick={this.onClickCreate}><Icon type="icon interface-72" />{trs('record.linkedData.create')}</Button>
            :
            null
        }
      </Row >
    );
  }

});

export default LinkedCatalogHeader;
