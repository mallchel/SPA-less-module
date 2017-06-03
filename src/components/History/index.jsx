import _ from 'lodash'
import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import ReactDOM from 'react-dom'
import $ from 'jquery'

import HistoryUserFilter from './HistoryUserFilter'
import trs from '../../getTranslations'
import historyActions from '../../actions/historyActions'
import HistoryItem from './HistoryItem'
import Loading from '../common/Loading'
import { connect } from '../StateProvider'

const HistoryData = React.createClass({
  mixins: [PureRenderMixin],
  props: {
    catalog: React.PropTypes.object.isRequired
  },

  catalogId() {
    return this.props.catalog.get('id');
  },

  onScroll: function (e) {
    if (!this.props.loading && ($(ReactDOM.findDOMNode(this.refs.table)).innerHeight() - e.target.scrollTop < window.innerHeight * 2)) {
      historyActions.loadHistory(this.catalogId());
    }
  },

  loadInitialHistory() {
    historyActions.loadHistory(this.catalogId(), null, {}, true);
  },

  componentDidMount() {
    this.loadInitialHistory();
    $(ReactDOM.findDOMNode(this.refs.node)).on('scroll', this.onScroll);
  },

  componentWillUnmount() {
    $(ReactDOM.findDOMNode(this.refs.node)).off('scroll', this.onScroll);
  },

  render() {
    const catalog = this.props.catalog;
    const catalogId = catalog.get('id');
    const fields = catalog.get('fields');
    const history = this.props.catalogsHistory.get(catalogId);
    const historyLoading = history && history.get('loading');
    let historyItems = history && history.get('items');

    let dataLoading = null;
    if (historyLoading) {
      dataLoading = <Loading />;
    }

    return (
      <div>
        <div className="list-header__additional--history content__column--border-bottom">
          <ul>
            <li className="column-record">{trs('catalogData.history.record')}</li>
            <li className="column-action">{trs('catalogData.history.action')}</li>
            <li className="column-user">
              <HistoryUserFilter catalogId={catalogId} />
            </li>
          </ul>
        </div>;
        <div className="history-data content__column--border-right" ref="node">
          <table
            ref="table"
            className="history__item-table unit-list unit-list--padding_default unit-list--header-accent_on unit-list--borders_on"
          >
            <tbody>
              {historyItems ? historyItems.map((h) =>
                <HistoryItem
                  key={h.get('id')}
                  item={h}
                  fields={fields}
                  catalogId={catalogId}
                  recordId={h.get('recordId')}
                  withRecordTitle={true}
                />
              ) : null}
            </tbody>
          </table>
          {dataLoading}
        </div>
      </div>
    );
  }
});

export default connect(HistoryData, ['catalogsHistory']);
