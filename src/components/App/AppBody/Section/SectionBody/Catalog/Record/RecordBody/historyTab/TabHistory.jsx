import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import LoadingSpinner from '../../../../../../../../common/LoadingSpinner'
import HistoryUserFilter from '../../../../../../../../History/HistoryUserFilter'
import History from './History'
import apiActions from '../../../../../../../../../actions/apiActions'
import historyActions from '../../../../../../../../../actions/historyActions'
import trs from '../../../../../../../../../getTranslations'

const TabHistory = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    catalogId: React.PropTypes.string.isRequired,
    history: React.PropTypes.object.isRequired,
    recordId: React.PropTypes.string
  },

  componentDidMount() {
    let { catalogId, recordId } = this.props;

    apiActions.getCatalog({ catalogId }).then(() => {
      historyActions.loadHistory(catalogId, recordId, {}, true);
    });
  },

  render() {
    const { catalogId, recordId, history, fields } = this.props;
    if (!history) {
      return null;
    }

    return (
      <div className="history">
        <div className="history-section__header">
          <span className="history-section__header-text">
            {trs('record.history.title')}
            {history.get('loading') ? <LoadingSpinner /> : null}
          </span>
          <span className="history-section__header-filter">
            <HistoryUserFilter catalogId={catalogId} recordId={recordId} />
          </span>
        </div>
        <History {...{ catalogId, recordId, history, fields }} />
      </div>
    );
  }
});

const TabHistoryController = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    catalogId: React.PropTypes.string.isRequired,
    record: React.PropTypes.object
  },
  render() {
    let { catalogId, record } = this.props;
    if (!record) {
      return null;
    }
    const recordId = record.get('id');
    const history = record.get('history');
    const fields = record.get('fields');

    return <TabHistory {...{ catalogId, recordId, history, fields }} />
  }
});

export default TabHistoryController;