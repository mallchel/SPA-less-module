import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import _ from 'lodash'
import { Icon } from 'antd'

import dndContext from '../../services/dndContext'
import FieldTypesItem from './FieldTypesItem'
import trs from '../../getTranslations'
import FIELD_TYPES from '../../configs/fieldTypes'

import styles from './fieldTypes.less'

const FieldTypes = React.createClass({
  mixins: [PureRenderMixin],

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.fieldInfo}>
          {trs('dragFieldToEditor')}
          <Icon type="icon interface-6" />
        </div>

        <div>
          {_.map(FIELD_TYPES, (fieldType) => {
            return <FieldTypesItem key={fieldType} type={fieldType} />;
          })}
        </div>

      </div>
    );
  }

});

export default dndContext(FieldTypes);
