import _ from 'lodash'
import trs from '../../../../../../../../../getTranslations'
import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Immutable from 'immutable'

function getValuesMap(values) {
  var map = {};
  (values || []).forEach((v)=>{
    map[v] = true;
  });
  return Immutable.fromJS(map);
}

const CheckboxesField = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    value: React.PropTypes.object,
    config: React.PropTypes.object,
    onSave: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      values: getValuesMap(this.props.value)
    };
  },

  onChangeItem(itemId) {
    var newValues = this.state.values.set(itemId, !this.state.values.get(itemId));
    this.setState({
      values: newValues
    });

    var values = [];
    newValues.forEach((v, id)=> {
      if ( v ) {
        values.push(id);
      }
    });

    this.props.onSave(this.props.fieldId, values);
  },

  componentWillReceiveProps(nextProps) {
    if ( !Immutable.is(nextProps.value, this.props.value) ) {
      this.setState({
        values: getValuesMap(nextProps.value)
      });
    }
  },

  render() {// get deleted values from
    let deletedValues = null;

    if (this.state.values) {
      let idsFromFilter = this.state.values.keySeq().toArray();
      let idsFromFieldConfig = this.props.config.get('items').map(item => item.get('id')).toArray();

      deletedValues = _.difference(idsFromFilter, idsFromFieldConfig).map(id => {
        return (
          <label
            key={id}
            className={'checkbox record-radio__item record-radio__item--selected'}>
            <input type="checkbox" checked={true} onChange={_.bind(this.onChangeItem, this, id)} />
            <span>{trs('filter.field.removed')}</span>
          </label>
        );
      });
    }

    return (
      <div className="record-radio">
        {this.props.config.get('items').map((item)=> {
          var id = item.get('id');
          var selected = this.state.values.get(id);
          return (
            <label
                key={id}
                className={'checkbox record-radio__item' + (selected ? ' record-radio__item--selected' : '')}
                style={{backgroundColor: '#' + item.get('color')}}>
              <input type="checkbox" checked={selected} onChange={_.bind(this.onChangeItem, this, id)} />
              <span>{item.get('name')}</span>
            </label>
          );
        })}

        {deletedValues}
      </div>
    );
  }
});

export default CheckboxesField;
