import _ from 'lodash'
import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import PropTypes from 'prop-types'
import apiActions from '../../../../../../../../actions/apiActions'
import appState from '../../../../../../../../appState'
import NavRoute from '../../../../../../../common/router/Route'
import routes from '../../../../../../../../routes'
import TabMain from './mainTab/TabMain'

// import RecordTabItem from './RecordTabItem'
import Loading from '../../../../../../../common/Loading'

/*const HistoryHeader = React.createClass({
  propTypes: {
    count: React.PropTypes.number.isRequired
  },
  render() {
    return (
      <span>
        <span className="icon icon--transfers-71 tab-item__icon" />
        <span className="tab-item__text">{trs('tab.history')}</span>
      </span>
    );
  }
});*/

// const Tabs = {
//   main: require('./mainTab/TabMain'),
//   //linkedData: require('./linkedDataTab/TabLinkedData'),
//   history: require('./historyTab/TabHistory')
// };

const RecordData = React.createClass({
  propTypes: {
    record: PropTypes.object.isRequired,
    catalog: PropTypes.object,
    onSaveField: PropTypes.func,
    unsavedFields: PropTypes.object,
    disableAutoSave: PropTypes.bool,
    isNew: PropTypes.bool,
    readOnly: PropTypes.bool.isRequired
  },

  componentDidMount() {
    // todo move from this
    if (!appState.getIn(['privilegeCodesLoaded']) && !appState.getIn(['privilegeCodesLoading'])) {
      apiActions.getPrivileges();
    }
  },

  render() {
    let _this = this;
    // let tabProps = {};

    const record = this.props.record;
    const isNew = this.props.isNew || record.get('isNew');
    const isLoading = !record || record.get('loading');
    const catalog = this.props.catalog;

    // switch (this.state.currentTab) {
    //   case 'main':
    //     tabProps.onSaveField = this.props.onSaveField;
    //     tabProps.unsavedFields = this.props.unsavedFields;
    //     tabProps.disableAutoSave = this.props.disableAutoSave;
    //     tabProps.readOnly = this.props.readOnly;
    //     tabProps.isNewRecord = isNew;
    //     break;
    //   case 'linkedData':
    //     break;
    //   case 'history':
    //     break;
    //   default:
    //     break;
    // }


    // let tabItems = [];
    // let historyHeader = <HistoryHeader count={record.getIn(['history', 'count']) || 0} />;


    // _.forEach(Tabs, (t, tabId)=> {
    // tabItems.push(
    {/*<RecordTabItem
          disabled={isNew && (tabId === 'linkedData' || tabId === 'history')}
          key={tabId}
          tabId={tabId}
          onClickItem={_this.onClickTab}
          selected={_this.state.currentTab === tabId}>

          { tabId === 'history' ? historyHeader : trs('record.tabs.' + tabId) }

        </RecordTabItem>*/}
    //   );
    // });

    return (
      <div className="record-data">
        {/*<ul className="tabs--record-tab">
          {tabItems}
        </ul>*/}

        <ReactCSSTransitionGroup
          transitionName="record-data-saving"
          transitionEnterTimeout={100}
          transitionLeaveTimeout={200}
        >
          {record.get('saving') ?
            <img className="record-data__saving" src="/modules/crm/images/loader.gif" /> : null}
        </ReactCSSTransitionGroup>

        {
          isLoading
            ? <Loading fullHeight={true} />
            :
            <NavRoute route={routes.record} render={prop => {
              return <TabMain
                record={record}
                catalog={catalog}
                onSaveField={this.props.onSaveField}
                unsavedFields={this.props.unsavedFields}
                disableAutoSave={this.props.disableAutoSave}
                isNewRecord={isNew}
                readOnly={this.props.readOnly}
              />
            }}
            />
          /*: <Tab record={record} catalogId={this.props.catalogId} {...tabProps} />*/
        }
      </div>
    );
  }

});

export default RecordData;
