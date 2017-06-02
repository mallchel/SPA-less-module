import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import ObjectField from '../../common/dataTypes/ObjectField';

const ChangeObject = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    change: React.PropTypes.object.isRequired,
    isNewRecord: React.PropTypes.bool
  },

  render() {
    let oldObjects = this.props.change.get('oldValue');
    let newObjects = this.props.change.get('newValue');

    //Фильтрация дубликатов
    let newObjectsList = newObjects.filter((object) => {
      return !oldObjects.find((testObject) => object.get('recordId') == testObject.get('recordId'));
    });
    let oldObjectsList = oldObjects.filter((object) => {
      return !newObjects.find((testObject) => object.get('recordId') == testObject.get('recordId'));
    });

    //Формирования списков
    let added = (<ul className="history__item-content-change-object">
      <ObjectField value={newObjectsList} list={true} />
    </ul>);
    let removed = (<ul className="history__item-content-change-object removed">
      <ObjectField value={oldObjectsList} list={true} />
    </ul>);

    return (
      <div>
        {oldObjectsList.size?removed:null}
        {newObjectsList.size?added:null}
      </div>
    );

  }

});

export default ChangeObject;
