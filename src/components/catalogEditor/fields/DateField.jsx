import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import trs from '../../../getTranslations'
import editorActions from '../../../actions/editorActions'
import { confirm } from '../../common/Modal'
import { Checkbox } from 'antd'

const DateField = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    originalField: React.PropTypes.object,
    field: React.PropTypes.object.isRequired,
    fieldIndex: React.PropTypes.number.isRequired,
    sectionId: React.PropTypes.string.isRequired,
    disabled: React.PropTypes.bool
  },
  getInitialState() {
    return {
      withTime: !!this.props.field.getIn(['config', 'time']),
      defaultValue: !!this.props.field.getIn(['config', 'defaultValue'])
    };
  },

  _onChangeWithTime(newVal) {
    this.setState({
      withTime: newVal
    });
    editorActions.changeFieldConfig(this.props.sectionId, this.props.fieldIndex, {
      time: newVal
    });
  },

  onChangeWithTime(e) {
    let newVal = e.target.checked;
    let { originalField } = this.props;
    let originalValue = originalField && originalField.getIn(['config', 'time']);

    if (!newVal && originalValue) {
      confirm({
        headerText: trs('modals.removeTimeFromDateConfirm.headerText'),
        text: trs('modals.removeTimeFromDateConfirm.text'),
        okText: trs('modals.removeTimeFromDateConfirm.okText'),
        cancelText: trs('modals.removeTimeFromDateConfirm.cancelText'),
        useRedOk: true
      }).result.then(() => {
        this._onChangeWithTime(newVal);
      });
    } else {
      this._onChangeWithTime(newVal);
    }
  },

  onChangeDefaultValue(e) {
    let defaultValue = e.target.checked;
    this.setState({
      defaultValue: defaultValue
    });
    editorActions.changeFieldConfig(this.props.sectionId, this.props.fieldIndex, {
      defaultValue: defaultValue
    });
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      withTime: nextProps.field.getIn(['config', 'time']),
      defaultValue: nextProps.field.getIn(['config', 'defaultValue'])
    });
  },

  render() {
    return (
      <div>
        <Checkbox
          disabled={this.props.disabled}
          checked={this.state.withTime}
          onChange={this.onChangeWithTime}
        >
          {trs('fieldTypes.date.withTime')}
        </Checkbox>
        <Checkbox
          disabled={this.props.disabled}
          checked={this.state.defaultValue}
          onChange={this.onChangeDefaultValue}
        >
          {trs('fieldTypes.date.default')}
        </Checkbox>
      </div>
    );
  }

});

export default DateField;
