import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import DropdownRemote from '../../../../../../../../common/DropdownRemote'
import trs from '../../../../../../../../../getTranslations'
import Immutable from 'immutable'
import classnames from 'classnames'
import _ from 'lodash'

const log = require('debug')('CRM:Component:Record:RemoteDropdown');

const RecordDropdown = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    value: React.PropTypes.object,
    config: React.PropTypes.object,
    remoteGroup: React.PropTypes.string.isRequired,
    onSave: React.PropTypes.func,
    requestParams: React.PropTypes.object,
    inMapper: React.PropTypes.func.isRequired,
    outMapper: React.PropTypes.func.isRequired,
    additionalItems: React.PropTypes.array
  },

  getInitialState() {
    let values = this.props.value || new Immutable.List();
    let filterValues = this.props.value || new Immutable.List();

    return {
      values: values,
      filterValues: filterValues,
      dropdownVisible: false
    };
  },

  onClickRemoveUser(keyName) {
    let index = (this.state.values.toJS() || [])
      .map(this.props.inMapper)
      .findIndex((u)=> u.key === keyName);

    let newValues = this.state.values.delete(index);

    this.setState({
      values: newValues,
      dropdownVisible: newValues.size === 0 ? false : this.state.dropdownVisible
    });

    this.props.onSave(this.props.fieldId, newValues.toJS());
  },

  onClickAdd(e) {
    e && e.preventDefault();
    this.setState({
      dropdownVisible: true
    });
  },

  onClickUser(userId, e) {
    e.preventDefault();
  },

  onSelectItems(item) {
    log('item', item);
    item = item[0];

    if (!item) {
      return;
    }

    log('add', item);
    let values = (this.state.values.toJS() || []).map(this.props.inMapper);

    if (!_.find(values, (it)=> it.key === item.key)) {
      let newValues;
      if (this.props.config.get('multiselect')) {
        newValues = this.state.values.push(Immutable.fromJS(this.props.outMapper(item)));
        this.setState({
          values: newValues
        });
      } else {
        newValues = Immutable.fromJS([this.props.outMapper(item)]);
        this.setState({
          values: newValues
        });
      }

      this.props.onSave(this.props.fieldId, newValues.toJS());
    }
  },

  onBlurDropdown() {
    this.setState({
      dropdownVisible: false
    });
  },

  componentWillMount() {
    this.props.eventHub.once('open', () => this.onClickAdd());
  },

  componentWillReceiveProps(nextProps) {
    if (!Immutable.is(nextProps.value, this.props.value) && nextProps.value) {
      log('cwrp', nextProps.value.toJS());
      this.setState({
        values: nextProps.value
      });
    }
  },

  render() {
    let multiselect = true;
    let firstValue = this.state.values.get(0);
    let firstValueKey = firstValue && firstValue.get('id');
    let selectedKeys = {};
    let cx = classnames({
      'record-user': true,
      'record-user--with-dropdown': this.state.dropdownVisible,
      'record-user--multiselect': multiselect
    });

    // add in additionItems add virtual user "Iam !"

    let additionalItems = this.props.value && this.props.value.toJS() || [];
    if (this.props.additionalItems)
      additionalItems.unshift.apply(additionalItems, this.props.additionalItems);

    return (
      <div className={cx}>
        <div className="record-user__items">
          {
            this.state.values.toJS().map(this.props.inMapper).map(item=> {
              selectedKeys[item.key] = true;
              return (
                <span key={item.key} className="record-user__item">
                  <span className={'icon icon--' + item.icon}/>
                  <span>{item.text}</span>
                  <span className="m-close" onClick={()=> this.onClickRemoveUser(item.key)}/>
                </span>
              );
            })
          }

          {
            multiselect || !firstValue ?
              <span className="record-user__item record-user__item--add">
                <span className="icon icon--users-1"/>
                <a href="javascript:void(0)" onClick={this.onClickAdd}>{trs('record.fields.user.addUser')}</a>
              </span> :
              null
          }

          { this.state.dropdownVisible && ( multiselect || !firstValue) ?
            <DropdownRemote
              type={this.props.remoteGroup}
              itemsMapper={this.props.itemsMapper}
              //outMapper={this.props.outMapper}
              requestParams={this.props.requestParams}
              autoFocus={true}
              filterFn={item => !selectedKeys[item.key]}
              onLoadItems={this.onLoadItems}
              additionalItems={additionalItems}
              autocomplete={true}
              clearOnSelect={multiselect}
              onBlur={this.onBlurDropdown}
              searchable={true}
              value={multiselect ? null : firstValueKey}
              onSelectItems={this.onSelectItems}
              sortBy={this.props.sortFn}
            /> :
            null }
        </div>
      </div>
    );
  }
});

export default RecordDropdown;
