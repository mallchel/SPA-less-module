import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ImmutablePropTypes from 'react-immutable-proptypes';

import trs from '../../../../../getTranslations';

import Widget from '../../widget'

// tabs
import Data from './data';
import DataFilter from './filter';

import SelectChart from './selectChart';

const tabs = [
  {
    id: 'data',
    component: Data,
    title: trs('reports.widget.modals.common.tabs.data.title')
  },
  {
    id: 'filter',
    component: DataFilter,
    title: trs('reports.widget.modals.common.tabs.filter.title')
  }
];

const WidgetPopupData = React.createClass({
  mixins: [PureRenderMixin],

  getInitialState() {
    return {
      currentTab: tabs[0]
    }
  },

  render() {
    console.log(this.props)
    const { currentTab } = this.state;
    const tabItems = tabs.map(tab => {
      const activeClass = currentTab === tab ? ' tabs__item--active' : '';
      return (
        <li
          key={tab.id}
          className={'tabs__item' + activeClass}
          onClick={() => this.setState({ currentTab: tab })}
        >
          {tab.title}
        </li>
      )
    });

    const { catalog } = this.props;
    const props = { ...this.props, ...{ catalog } };

    return (
      <div>
        <div className="m-padding-horizontal widget-edit-modal__tabs">
          <ul className="tabs">
            {tabItems}
          </ul>
        </div>

        <div className={
          'modal-window__content modal-window__content__padding widget-config ' +
          'widget-config--' + currentTab.id}>
          <div className="widget-config__data">
            <currentTab.component {...props} />
          </div>
        </div>

        <div className="widget-config__demo container-fluid">
          <div className="widget-demo modal-window__content__padding row">
            <div className="col-md-3 widget-demo__select-chart-type">
              <SelectChart {...props} />
            </div>
            <div className="col-md-9 widget-demo__widget widget-demo-widget">
              <span
                className="m-text_muted widget-demo-widget__title">{
                  trs('reports.widget.modals.common.preview.demo')
                }</span>
              <Widget {...props} />
            </div>
          </div>
        </div>
      </div>
    );
  }
});

export default WidgetPopupData;
