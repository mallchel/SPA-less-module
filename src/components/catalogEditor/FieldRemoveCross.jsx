import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import editorActions from '../../actions/editorActions'
import { confirm } from '../common/Modal'
import trs from '../../getTranslations'

const FieldRemoveCross = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    fieldId: React.PropTypes.string,
    fieldIndex: React.PropTypes.number.isRequired,
    sectionId: React.PropTypes.string.isRequired
  },

  removeField() {
    editorActions.removeField(this.props.sectionId, this.props.fieldIndex);
  },

  onClick() {
    if (this.props.fieldId) {
      confirm({
        headerText: trs('modals.removeFieldConfirm.header'),
        text: trs('modals.removeFieldConfirm.text'),
        okText: trs('modals.removeFieldConfirm.okText'),
        cancelText: trs('modals.removeFieldConfirm.cancelText'),
        useRedOk: true
      }).result.then(() => {
        this.removeField();
      });
    } else {
      this.removeField();
    }
  },

  render() {
    return (
      <span className="field-cross m-close" onClick={this.onClick}></span>
    );
  }

});

export default FieldRemoveCross;
