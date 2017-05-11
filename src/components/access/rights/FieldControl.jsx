import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import classNames from 'classnames';
import Reflux from 'reflux';
import _ from 'lodash'
import trs from '../../../getTranslations';

const FieldControl = React.createClass({
  mixins: [
    PureRenderMixin
  ],
  propTypes: {
    value: React.PropTypes.string,
    onSave: React.PropTypes.func.isRequired,
    readOnly: React.PropTypes.bool
  },

  getInitialState() {
    return {
      value: this.props.value
    };
  },

  onChangeItem(itemId) {
    this.setState({
      value: itemId
    });
    this.props.onSave(itemId);
    //recordActions.clearErrorField(this.props.catalogId, this.props.recordId, this.props.fieldId);
  },

  componentDidMount() {
    this.setState({
      value: this.props.value
    });
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.value) {
      this.setState({
        value: nextProps.value
      });
    }
  },

  render() {
    let items = [{
      id: 'view',
      name: trs('rights.view'),
      color: 'D3E3FF'
    }, {
      id: 'edit',
      name: trs('rights.edit'),
      color: 'D0FBBF'
    }];
    return (
      <div className={'record-dropdown'}>
        {items.map((item)=> {
          let id = item.id;
          let selected = this.state.value === item.id;
          return (
            <span
              key={id}
              onClick={_.bind(this.onChangeItem, this, id)}
              className={'record-dropdown__item' + (selected ? ' record-dropdown__item--selected' : '')}
              style={{backgroundColor: '#' + item.color}}>
              {item.name}
            </span>
          );
        })}
      </div>
    );
  }
});

export default FieldControl;
