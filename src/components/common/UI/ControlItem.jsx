import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import cn from 'classnames'
import { Row } from 'antd'
import FIELD_TYPES from '../../../configs/fieldTypes'

import styles from './mainTab.less'

import Hint from './hint'

const Control = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    name: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,
    hint: React.PropTypes.string,
    error: React.PropTypes.string,
    required: React.PropTypes.bool
  },

  render() {
    let labelClass = cn(styles.fieldHeader, {
      [styles.fieldHeaderError]: this.props.error
    });
    return (
      <Row type="flex" justify="start">
        <div className={labelClass} title={this.props.name}>
          {this.props.name}
          {this.props.required ? (<div className={styles.fieldRequiredAsterisk} />) : null}
        </div>

        {(() => {
          switch (this.props.type) {
            case FIELD_TYPES.CONTACT:
            case FIELD_TYPES.TEXT:
            case FIELD_TYPES.NUMBER:
              // hide span-hint, if have value.
              return <div className={styles.fieldBody}>{this.props.children}</div>;

            case FIELD_TYPES.DATE:
            case FIELD_TYPES.PROGRESS:
            case FIELD_TYPES.STARS:
              return <div className={styles.fieldBody}>
                {this.props.children}
                <Hint className="record-field__body__hint--in-top" text={this.props.hint} readOnly={this.props.readOnly} />
              </div>;

            case FIELD_TYPES.DROPDOWN:
            case FIELD_TYPES.CHECKBOXES:
            case FIELD_TYPES.RADIOBUTTON:
            case FIELD_TYPES.USER:
            case FIELD_TYPES.OBJECT:
            case FIELD_TYPES.FILE:
              return <div className={styles.fieldBody}>
                <Hint className="record-field__body__hint--in-top" text={this.props.hint} readOnly={this.props.readOnly} />
                {this.props.children}
              </div>;
            default:
              break;
          }
        })()}
      </Row>
    );
  }

});

export default Control;
