import React from 'react'
import ReactDOM from 'react-dom'
import $ from 'jquery'
import PropTypes from 'prop-types'
import trs from '../../../../../../../../../../getTranslations'
import Records from './Records'
import recordActions from '../../../../../../../../../../actions/recordActions'
import Loading from '../../../../../../../../../common/Loading'

const RecordsBody = React.createClass({
  propTypes: {
    catalog: PropTypes.object.isRequired,
    fieldsWidth: PropTypes.object.isRequired,
    fieldsToRender: PropTypes.object.isRequired,
    updateInitialX: PropTypes.func
  },

  onScroll(e) {
    $(ReactDOM.findDOMNode(this)).scrollLeft(0);

    if (this.props.catalog.get('allRecordsLoaded') ||
      this.props.catalog.get('loading')) {
      return;
    }

    let el = e.target;
    let sh = el.scrollHeight;
    let oh = el.offsetHeight;

    if (sh <= oh) {
      return;
    }

    let toBottom = sh - oh - el.scrollTop;

    if (toBottom < 600) {
      let records = this.props.catalog.get('records');
      let offset = (records && records.size) || 0;

      // by catalog id.
      recordActions.requestForRecords(this.props.catalog.get('id'), { offset });
    }
  },

  componentDidMount() {
    $(ReactDOM.findDOMNode(this.refs.table)).parent().on('scroll', this.onScroll);
  },

  componentWillMount() {
    this.startOffset = 0;
  },

  componentWillUnmount() {
    let table = $(ReactDOM.findDOMNode(this.refs.table));
    table.parent().off('scroll', this.onScroll);
  },

  componentWillReceiveProps(nextProps) {
    //if ( this.props.catalog.get('id') !== nextProps.catalog.get('id') ) {
    //  recordActions.requestForRecords(nextProps.catalog.get('id'));
    //}

    if (this.isTableOutOfCnt() || this.getLeftOffset() > 0) {
      this.props.updateInitialX();
    }
  },

  isTableOutOfCnt() {
    let offset = this.props.leftOffset || 0;
    let leftOffset = this.startOffset + offset;
    let cntWidth = this.props.width;
    let colsWidth = this.props.allColumnsWidth;

    return (colsWidth - Math.abs(leftOffset) < cntWidth);
  },

  getLeftOffset() {
    let offset = this.props.leftOffset || 0;

    return this.startOffset + offset;
  },

  getCntAndTableDiff() {
    let cntWidth = this.props.width;
    let colsWidth = this.props.allColumnsWidth;

    return colsWidth - cntWidth;
  },

  calcOffset() {
    let diff = this.getCntAndTableDiff();
    this.leftOffset = this.getLeftOffset();

    if (this.leftOffset > diff) {
      this.leftOffset = diff;
    }

    if (this.props.mouseUp && (this.startOffset !== 0 || this.leftOffset !== 0)) {
      if (this.isTableOutOfCnt()) {
        this.startOffset = -(this.getCntAndTableDiff());
      } else {
        this.startOffset = this.leftOffset;
      }
    }
  },

  componentDidUpdate(prevProps, prevState) {
    this.calcOffset();
  },

  render() {
    let items;

    if (this.props.showLoading) {
      items = <tr className="unit-list--loading"><td>loading...</td></tr>;
    } else {
      items = this.props.catalog.get('records')
        ?
        <Records
          fields={this.props.catalog.get('fields')}
          records={this.props.catalog.get('records')}
          fieldsToRender={this.props.fieldsToRender}
          fieldsWidth={this.props.fieldsWidth}
        />
        : null
    }

    let styles = {},
      classNames = 'list-data ';

    let dataLoading = null;
    if (this.props.loading) {
      dataLoading = <Loading error={this.props.catalog.get('loadingError') ? trs('loadingError') : null} />;
    }

    return (
      <div className={classNames}
        onMouseDown={this.props.onMouseDown}
        onMouseMove={this.props.onMouseMove}
      >
        <div className="left-fading" />
        <table ref="table" className="data-table unit-list unit-list--padding_default unit-list--header-accent_on unit-list--borders_on" style={styles}>
          {items}
        </table>
        {dataLoading}
        <div className="right-fading" />
      </div>
    );
  }
});

export default RecordsBody;
