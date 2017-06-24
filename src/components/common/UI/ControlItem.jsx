import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import cn from 'classnames'
import PropTypes from 'prop-types'
import { Row } from 'antd'
import FIELD_TYPES from '../../../configs/fieldTypes'

import styles from './controlList.less'

import Hint from './controls/common/Hint'

const ControlItem = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    controlConfig: PropTypes.object.isRequired,
    hint: PropTypes.string,
    error: PropTypes.string,
    required: PropTypes.bool,
    labelRef: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.func
    ])
  },

  render() {
    const headerClass = cn(styles.fieldHeader, {
      [styles.fieldHeaderError]: this.props.error
    });
    const { name, required, type, readOnly, hint, htmlId, labelRef } = this.props;

    return (
      <Row type="flex" justify="start">
        <div className={headerClass} title={name}>
          <label ref={labelRef} className={styles.headerLabel} htmlFor={htmlId}>
            {name}
          </label>
          {required ? (<div className={styles.fieldRequiredAsterisk} />) : null}
        </div>

        {(() => {
          switch (type) {
            case FIELD_TYPES.TEXT:
            case FIELD_TYPES.NUMBER:
            case FIELD_TYPES.DATE:
            case FIELD_TYPES.PROGRESS:
            case FIELD_TYPES.STARS:
              return <div className={styles.fieldBody}>
                {this.props.children}
                <Hint text={hint} readOnly={readOnly} />
              </div>;

            case FIELD_TYPES.CONTACT:
            case FIELD_TYPES.DROPDOWN:
            case FIELD_TYPES.CHECKBOXES:
            case FIELD_TYPES.RADIOBUTTON:
            case FIELD_TYPES.USER:
            case FIELD_TYPES.OBJECT:
            case FIELD_TYPES.FILE:
              return <div className={styles.fieldBody}>
                <Hint text={hint} readOnly={readOnly} />
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

export default ControlItem;
