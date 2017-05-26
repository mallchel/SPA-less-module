import React from 'react';
import Immutable from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import _ from 'lodash';
import Items from './Items';
import modalsActions from '../../../actions/modalsActions';

const ObjectField = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    value: React.PropTypes.object.isRequired,
    list: React.PropTypes.bool,
    config: React.PropTypes.object
  },

  onClickItem(item, e) {
    e.preventDefault();
    e.stopPropagation();
    let {recordId, catalogId, recordTitle} = item.obj.toJS();
    modalsActions.openRecordModal(catalogId, recordId, recordTitle);
  },

  render() {
    const value = this.props.value || Immutable.List();

    if (this.props.list) {
      let result =  value.map((val, i) => {
        return (<li key={i}>
          <span className={'icon icon--' + val.get('catalogIcon')} />
          <span>
            <a href="javascript:void(0)" onClick={_.bind(this.onClickItem, this, {obj: val})}>{val.get('recordTitle')}</a>
          </span>
        </li>)
      }).toJS();
      const removedClass = this.props.removed? 'object-list removed' : 'object-list';
      return (<ul className={removedClass}>{result}</ul>)

    }
    return (
      <Items inContainers={this.props.inContainers == undefined || false} onClick={this.onClickItem} values={value.map((f)=> {
        return {
          obj: f,
          name: f.get('recordTitle'),
          icon: f.get('catalogIcon'),
          disabled: f.get('isRemoved') || this.props.removed || false
        };
      }).toArray()} />
    );
  }
});

export default ObjectField;
