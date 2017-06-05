import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'


import dndContext from '../../services/dndContext'
import FieldTypesItem from './FieldTypesItem'
import trs from '../../getTranslations'
import FIELD_TYPES from '../../configs/fieldTypes'
import _ from 'lodash'

const FieldTypes = React.createClass({
  mixins: [PureRenderMixin],

  render() {
    return (
      <div className="field-types">
        <header className="header header--no-border">
          <p className="header__subtitle">&nbsp;</p>
          <div className="header__data">
            <h1 className="header__data__title">
              <span>&nbsp;</span>
            </h1>
          </div>
        </header>

        <div className="field-info">
          <span className="field-info__text">{trs('dragFieldToEditor')}</span>
          <div className="field-info__icon icon icon--interface-6"></div>
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