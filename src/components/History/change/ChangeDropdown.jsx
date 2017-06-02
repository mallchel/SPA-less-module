import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import trs from '../../../getTranslations';

import FIELD_TYPES from '../../../configs/fieldTypes';
import Items from '../../common/dataTypes/Items';
import ChangeDirection from './ChangeDirection';

const ChangeDropdown = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    change: React.PropTypes.object.isRequired,
    config: React.PropTypes.object.isRequired,
    isNewRecord: React.PropTypes.bool
  },

  render() {

    let oldValues = this.props.change.get('oldValue')
      .filter((value) => (this.props.change.get('newValue').indexOf(value) === -1))
      .map((value) => {
        let item = this.props.config.get('items').find((item) => item.get('id') == value);
        if (item) {
          return {
            name: item.get('name'),
            color: item.get('color')
          };
        }
        return {
          name: trs('record.history.unknown'),
          color: ''
        };
      });
    let newValues = this.props.change.get('newValue')
      .filter((value) => (this.props.change.get('oldValue').indexOf(value) === -1))
      .map((value) => {
        let item = this.props.config.get('items').find((item) => item.get('id') == value);
        if (item) {
          return {
            name: item.get('name'),
            color: item.get('color')
          };
        }
        return {
          name: trs('record.history.unknown'),
          color: ''
        };
      });
    let oldClass = 'removed';
    if (oldValues.size == newValues.size == 1) {
      let fromObj = <Items values={oldValues} inContainers={true} fieldType={FIELD_TYPES.DROPDOWN}/>;
      let toObj = <Items values={newValues} inContainers={true} fieldType={FIELD_TYPES.DROPDOWN}/>;
      return (<ChangeDirection fromObj={fromObj} toObj={toObj} />);
    } else {
      return (
        <span>
          <span className={oldClass}>
            <Items values={oldValues} inContainers={true} fieldType={FIELD_TYPES.DROPDOWN}/>
          </span>
          <span>
            <Items values={newValues} inContainers={true} fieldType={FIELD_TYPES.DROPDOWN}/>
          </span>
        </span>
      );
    }
  }

});

export default ChangeDropdown;
