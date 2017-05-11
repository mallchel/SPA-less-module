import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ClassNames from 'classnames';
import trs from '../../getTranslations';
import ViewInputModal from './ViewInputModal';
import filterActions from '../../actions/filterActions';
import modalsActions from '../../actions/modalsActions';
import DropDownButton from '../../components/common/DropdownButton';

import PRIVILEGE_CODES from '../../configs/privilegeCodes';
import RESOURCE_TYPES from '../../configs/resourceTypes';
import {checkAccessOnObject} from '../../utils/rights';


const ViewsItem = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    view: React.PropTypes.object,
    currentCatalog: React.PropTypes.object,
    currentCatalogId: React.PropTypes.string,
    onClick: React.PropTypes.func.isRequired,
    selected: React.PropTypes.bool
  },

  onSelectItem() {
    let id = this.props.view.get('id');
    this.props.onClick(id);
  },

  onModalNewView() {
    // implement:
    let accessOnViewForRights = checkAccessOnObject(RESOURCE_TYPES.CATALOG,
      this.props.currentCatalog,
      PRIVILEGE_CODES.ACCESS);
    modalsActions.openViewInputModal(this.props.currentCatalogId, accessOnViewForRights);
  },


  render() {
    let name = this.props.view.get('originName')
      ? this.props.view.get('originName')
      : this.props.view.get('name');
    let isNew = this.props.view.get('isNew');

    return isNew ?
      <div className={ClassNames({'nunit-list__row': 1, 'm-select': 1, 'new' : 1})}>
        {trs('views.newView')}
        <DropDownButton items={[]} onClick={this.onModalNewView} text={trs('buttons.save')}/>
      </div> :

      <div
        title={name}
        className={ClassNames({'nunit-list__row': 1, 'm-select': this.props.selected})}
        onClick={this.onSelectItem}>{name}</div>
  }
});

export default ViewsItem;
