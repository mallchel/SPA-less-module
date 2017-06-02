import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import FIELD_TYPES from '../../configs/fieldTypes'

const changeComponents = {
  [FIELD_TYPES.TEXT]: require('./change/ChangeText').default,
  [FIELD_TYPES.NUMBER]: require('./change/ChangeNumber').default,
  [FIELD_TYPES.DATE]: require('./change/ChangeDate').default,
  [FIELD_TYPES.DROPDOWN]: require('./change/ChangeDropdown').default,
  [FIELD_TYPES.CHECKBOXES]: require('./change/ChangeCheckboxes').default,
  [FIELD_TYPES.RADIOBUTTON]: require('./change/ChangeRadiobutton').default,
  [FIELD_TYPES.PROGRESS]: require('./change/ChangeProgress').default,
  [FIELD_TYPES.STARS]: require('./change/ChangeStars').default,
  [FIELD_TYPES.USER]: require('./change/ChangeUser').default,
  [FIELD_TYPES.OBJECT]: require('./change/ChangeObject').default,
  [FIELD_TYPES.FILE]: require('./change/ChangeFile').default,
  [FIELD_TYPES.CONTACT]: require('./change/ChangeContact').default,
};

const HistoryItemChange = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    field: React.PropTypes.object.isRequired,
    change: React.PropTypes.object.isRequired,
    isNewRecord: React.PropTypes.bool
  },


  render() {
    let field = this.props.field;
    let change = this.props.change;
    let isNewRecord = this.props.isNewRecord;
    let fieldTitle = field.get('name');
    let fieldType = field.get('type');
    let fieldConfig = field.get('config');
    let Comp = changeComponents[fieldType];

    if (!Comp) {
      return (<div>NOT FOUND: {fieldType}</div>);
    }

    return (
      <div className="history__item-change">
        <div className="history__item-title">
          {fieldTitle}
        </div>
        <Comp change={change} config={fieldConfig} isNewRecord={isNewRecord} />
      </div>
    );
  }

});

export default HistoryItemChange;
