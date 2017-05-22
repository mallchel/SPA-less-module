import Reflux from 'reflux';
import FieldErrorsStore from '../../stores/FieldErrorsStore';

export default function (getDomNode) {
    return {
        ...Reflux.listenTo(FieldErrorsStore, "onFocusEvent"),
        onFocusEvent(eventObj) {
            let isFocusEvent = eventObj.event && eventObj.event == 'onFocus';
            let recordId = this.props.recordId;
            let isSelfEvent = eventObj.catalogId == this.props.catalogId
                && eventObj.recordId == recordId
                && eventObj.fieldId == this.props.fieldId;
            if (isFocusEvent && isSelfEvent && getDomNode) {
                let domNode = getDomNode.call(this);
                if (domNode) {
                    domNode.focus();
                }
            }
        }
    };
};