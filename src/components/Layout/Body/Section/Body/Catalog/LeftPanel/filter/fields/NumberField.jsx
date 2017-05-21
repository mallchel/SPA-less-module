import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Immutable from 'immutable'
import _ from 'lodash'
import trs from '../../../getTranslations'

// const NumberField = React.createClass({
//   mixins: [PureRenderMixin],
//   propTypes: {
//     value: React.PropTypes.number,
//     config: React.PropTypes.object,
//     onSave: React.PropTypes.func.isRequired,
//     placeholder: React.PropTypes.string
//   },
//
//   getInitialState(){
//     return {
//       value: this.props.value
//     }
//   },
//
//   componentWillReceiveProps(nextProps) {
//     this.setState({value: nextProps.value});
//   },
//
//   onSave(value) {
//     let result = {};
//     result[this.props.name] = value || null;
//     this.props.onSave(result);
//   },
//
//   onChange(e){
//     let val = e.target.value;
//
//     if ( val !== '' ) {
//       val = val.replace(/,/g, '.');
//       if ( isNaN(Number(val)) ) {
//         return;
//       }
//     }
//
//     this.setState({
//       value: val
//     }, ()=>{
//       this.onSave(val);
//     });
//   },
//
//   render() {
//     return (
//
//     );
//   }
// });

const NumberRangeField = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    value: React.PropTypes.object,
    config: React.PropTypes.object,
    onSave: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {value: this.props.value}
  },

  componentDidMount() {
    this.onSave = neededArgs => {
      this.props.onSave(this.props.fieldId, _.transform(neededArgs, function (res, v, k) {
        if (v) res[k] = v;
      }));
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({value: nextProps.value});
  },

  // refactor.
  onSaveFrom(pref, e) {
    let value = e.target.value;
    if (value !== '') {
      value = value.replace(/,/g, '.');
      //Не даем вводить если попытка ввода НЕ числа, при этом разрешаем ввести один «-», чтобы можно было ввести отрицательноче число
      if (isNaN(Number(value)) && (value != '-')) {
        let $value = this.state.value || Immutable.Map();
        value = $value.set(pref, $value.get(pref) || '');
        this.setState({value});
        return;
      }
    }
    let $value = this.state.value || Immutable.Map();
    value = $value.set(pref, value);
    this.setState({value}, () => {
      this.onSave(value.toJS());
    });
  },

  render() {
    let startNum, endNum;
    let value = this.state.value;

    if (value) {
      startNum = value.get('at');
      endNum = value.get('to');
    }

    return (
      <div className="input-range">

        <span className="record-number">
          <input
            type="text"
            className="debounced-input debounced-input--empty"
            value={startNum}
            placeholder={trs('fieldTypes.number.fromText')}
            onChange={(e) => this.onSaveFrom('at', e)}
            />
        </span>

        <span className="record-number">
          <input
            type="text"
            className="debounced-input debounced-input--empty"
            value={endNum}
            placeholder={trs('fieldTypes.number.toText')}
            onChange={(e) => this.onSaveFrom('to', e)}
            />
        </span>

        <span>{this.props.config.get('unit')}</span>
      </div>
    );
  }
});

export default NumberRangeField;
