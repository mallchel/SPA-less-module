import React from 'react'
import PropTypes from 'prop-types'
import userSettingsActions from '../../../../../../../../../../actions/userSettingsActions'
import trs from '../../../../../../../../../../getTranslations'
import FieldConfig from './FieldConfig'
import ListHeaderField from './ListHeaderField'

import UserSettingsStore from '../../../../../../../../../../stores/UserSettingsStore'

const RecordsHeader = React.createClass({
  propTypes: {
    fieldsWidth: PropTypes.object.isRequired,
    fieldsToRender: PropTypes.object.isRequired,
    leftOffset: PropTypes.number.isRequired,
    catalog: PropTypes.object.isRequired
  },

  componentWillMount() {
    this.startOffset = 0;
    this.leftOffset = 0;
  },

  componentDidUpdate(prevProps, prevState) {
    let offset = this.props.leftOffset;
    let colsWidth = this.props.allColumnsWidth;
    let cntWidth = this.props.width;
    this.leftOffset = this.startOffset + offset;

    // todo refactor this to move this parameters to state

    if (this.leftOffset > colsWidth - cntWidth) {
      this.leftOffset = colsWidth - cntWidth;
    }

    if (this.props.mouseUp && (this.startOffset !== 0 || this.leftOffset !== 0)) {
      let isTableOutOfCnt = (colsWidth - Math.abs(this.leftOffset) < cntWidth);

      if (isTableOutOfCnt) {
        this.startOffset = -(colsWidth - cntWidth);
      } else {
        this.startOffset = this.leftOffset;
      }
    }
  },

  onChangeSorting(colId, sorting) {
    let sortField;
    let catalogId = this.props.catalog.get('id');

    if (colId === 'id') {
      sortField = 'id';
    } else {
      sortField = this.props.catalog.get('fields').find((c) => c.get('id') === colId).get('id');
    }

    // save setting sorting
    userSettingsActions.setSortingRecords({ catalogId }, { sortField, sortType: sorting })
  },

  render() {
    let catalogId = this.props.catalog.get('id');
    const fields = this.props.catalog.get('fields');

    // get sort info from user settings.
    let sortingRecordSetting = UserSettingsStore.getSortingRecords({ catalogId });

    var headers = [],
      sortField = sortingRecordSetting.get('sortField'),
      sortType = sortingRecordSetting.get('sortType');

    headers.push(
      <ListHeaderField
        key={0}
        text={trs('catalogData.indexFieldName')}
        fieldId={'id'}
        onChangeSorting={this.onChangeSorting}
        sorting={sortField === 'id' ? sortType : 0} />
    );

    this.props.fieldsToRender.forEach((col, i) => {
      let fieldId = col.get('id');

      headers.push(
        <ListHeaderField
          key={fieldId}
          fieldId={fieldId}
          width={this.props.fieldsWidth.get(fieldId)}
          catalogId={this.props.catalog.get('id')}
          onChangeSorting={this.onChangeSorting}
          text={col.get('name')}
          sorting={fieldId === sortField ? sortType : 0} />
      );
    });

    let offset = this.props.leftOffset || 0;
    let leftOffset = parseInt(this.startOffset + offset, 10);
    let cntWidth = this.props.width;
    let colsWidth = this.props.allColumnsWidth;
    let isTableOutOfCnt = (colsWidth - Math.abs(leftOffset) < cntWidth);

    let styles = {},
      classNames = 'table-header';

    if (leftOffset >= 0) {
      styles.transform = 'translateX(0px)';
      this.startOffset = 0;
    } else {
      if (isTableOutOfCnt) {
        var endOffset = -(colsWidth - cntWidth);

        this.startOffset = endOffset;
        styles.transform = 'translateX(' + (endOffset) + 'px)';
        classNames += ' show-left-fading no-right-fading';
      } else {
        styles.transform = 'translateX(' + leftOffset + 'px)';
        classNames += ' show-left-fading';
      }
    }
    return (
      <div className={classNames}>
        <div className="left-fading" />
        <div className="table-header__fields-cnt">
          <div className="table-header__fields" style={styles}>
            {headers}
          </div>
        </div>

        {
          fields && <FieldConfig
            catalogId={this.props.catalog.get('id')}
            fields={fields} />
        }

        <div className="right-fading" />
      </div>
    );
  }
});

export default RecordsHeader;
