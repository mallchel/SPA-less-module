import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import classNames from 'classnames'
import modalsActions from '../../../../../../../../../actions/modalsActions'
import LinkedCatalogHeader from './LinkedCatalogHeader'
import LinkedRecord from './LinkedRecord'

const LinkedCatalog = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    catalog: React.PropTypes.object.isRequired,
    onClickCreate: React.PropTypes.func,
    loadLinkedData: React.PropTypes.func,
    index: React.PropTypes.number
  },

  getInitialState() {
    let records = this.props.catalog.get('records');
    let recordsCount = records && (records.size || 0);

    return {
      open: recordsCount > 0
    };
  },

  onClickCreate(e) {
    this.props.onClickCreate(this.props.catalog.get('id'));
  },

  onClickHeader() {
    this.setState({
      open: !this.state.open
    });
  },

  onClickRecord(recordId, recordName) {
    // this.props.onClickRecord(this.props.catalog.get('id'), recordId, recordName);
    modalsActions.openRecordModal(this.props.catalog.get('id'), recordId, recordName);
  },

  componentWillReceiveProps(props) {
    let records = props.catalog.get('records');
    let recordsCount = records && records.size || 0;

    if (this._lastRecordsCount !== recordsCount) {
      this.setState({
        open: recordsCount > 0
      });
    }

    this._lastRecordsCount = recordsCount;
  },

  render() {
    let isOpen = this.state.open;
    let records = this.props.catalog.get('records');
    let recordsCount = records && records.size || 0;
    let recordsRows = null;

    if (isOpen && recordsCount) {
      recordsRows = records.valueSeq().map((record) =>
        (<LinkedRecord key={record.get('id')} record={record} onClickRecord={this.onClickRecord} />)
      );
    }

    let tableClassName = classNames('unit-list unit-list--padding_default unit-list--header-accent_on unit-list--borders_on linked-catalog', {
      'first': this.props.index == 0
    });

    let wrapperClassName = classNames('linked-catalog-wrapper', {
      'linked-catalog-wrapper--open': isOpen
    });

    return (
      <div className={wrapperClassName}>
        <LinkedCatalogHeader
          catalog={this.props.catalog}
          open={isOpen}
          onClickHeader={this.onClickHeader}
          onClickCreate={this.onClickCreate}
        />
        {recordsRows}
      </div>
    );
  }
});

export default LinkedCatalog;
