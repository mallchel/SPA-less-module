import _ from 'lodash';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import trs from '../../getTranslations';
import apiActions from '../../actions/apiActions';
import appState from '../../appState';

import RecordTabItem from './RecordTabItem';
import Loading from '../common/Loading';

const HistoryHeader = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    count: React.PropTypes.number.isRequired
  },
  render() {
    return (
      <span>
        <span className="icon icon--transfers-71 tab-item__icon"/>
        <span className="tab-item__text">{trs('tab.history')}</span>
      </span>
    );
  }
});

const Tabs = {
  main: require('./mainTab/TabMain'),
  //linkedData: require('./linkedDataTab/TabLinkedData'),
  history: require('./historyTab/TabHistory')
};

const log = require('debug')('CRM:Component:Record:Data');

const RecordData = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    record: React.PropTypes.object.isRequired,
    currentTab: React.PropTypes.string,
    catalogId: React.PropTypes.string,
    onClickTab: React.PropTypes.func,
    onSaveField: React.PropTypes.func,
    unsavedFields: React.PropTypes.object,
    disableAutoSave: React.PropTypes.bool,
    isNew: React.PropTypes.bool,
    readOnly: React.PropTypes.bool.isRequired
  },

  getInitialState() {
    return {
      currentTab: this.props.currentTab || 'main'
    };
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentTab) {
      this.setState({
        currentTab: nextProps.currentTab
      });
    }
  },

  onClickTab(tabId) {
    this.setState({
      currentTab: tabId
    });
    if (typeof this.props.onClickTab === 'function') {
      this.props.onClickTab(tabId);
    }
  },

  componentDidMount() {
    // todo move from this
    if (!appState.getIn(['privilegeCodesLoaded']) && !appState.getIn(['privilegeCodesLoading'])) {
      apiActions.getPrivileges();
    }
  },

  render() {
    let _this = this;
    let Tab = Tabs[this.state.currentTab];
    let tabProps = {};

    let record = this.props.record;
    let isNew = this.props.isNew || record.get('isNew');
    let isLoading = !record || record.get('loading');

    switch (this.state.currentTab) {
      case 'main':
        tabProps.onSaveField = this.props.onSaveField;
        tabProps.unsavedFields = this.props.unsavedFields;
        tabProps.disableAutoSave = this.props.disableAutoSave;
        tabProps.readOnly = this.props.readOnly;
        tabProps.isNewRecord = isNew;
        break;
      case 'linkedData':
        break;
      case 'history':
        break;
      default:
        break;
    }


    let tabItems = [];
    let historyHeader = <HistoryHeader count={record.getIn(['history', 'count']) || 0}/>;


    _.forEach(Tabs, (t, tabId)=> {
      tabItems.push(
        <RecordTabItem
          disabled={isNew && (tabId === 'linkedData' || tabId === 'history')}
          key={tabId}
          tabId={tabId}
          onClickItem={_this.onClickTab}
          selected={_this.state.currentTab === tabId}>

          { tabId === 'history' ? historyHeader : trs('record.tabs.' + tabId) }

        </RecordTabItem>
      );
    });

    return (
      <div className="record-data">
        <ul className="tabs--record-tab">
          {tabItems}
        </ul>

        <ReactCSSTransitionGroup
          transitionName="record-data-saving"
          transitionEnterTimeout={100}
          transitionLeaveTimeout={200}
        >
          {record.get('saving') ?
            <img className="record-data__saving" src="/modules/crm/images/loader.gif"/> : null }
        </ReactCSSTransitionGroup>

        <div className={'record-tab-container record-tab-container--' + this.state.currentTab}>
          {
            isLoading
              ? <Loading fullHeight={true}/>
              : <Tab record={record} catalogId={this.props.catalogId} {...tabProps} />
          }
        </div>
      </div>
    );
  }

});

export default RecordData;
