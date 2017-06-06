import Reflux from 'reflux'
import ViewInputModal from '../components/views/ViewInputModal'
import modalsActions from '../actions/modalsActions'
import viewsActions from '../actions/viewActions'
import recordActions from '../actions/recordActions'
import apiActions from '../actions/apiActions'
import trs from '../getTranslations'
import guid from 'guid'
import appState from '../appState'
import RESOURCE_TYPES from '../configs/resourceTypes'
import { renderModaltoBody } from '../components/common/Modal'
import { MODAL_ONLY } from '../configs/appModes'

function _openRecordModal(component, catalogId, recordId, recordName, { allowClose, onCreate }) {
  let mode = appState.getIn(['mode']);
  let isFullScreen = appState.getIn(['modalsFullScreen']);

  renderModaltoBody(component, {
    recordId,
    recordName,
    catalogId,
    allowClose,
    onSave: onCreate
  }, {
      css: 'record-modal ' + (isFullScreen && 'record-modal--full-screen')
    }, mode === MODAL_ONLY);
}

const ModalStore = Reflux.createStore({
  listenables: [modalsActions],

  openAccessModal({ object, parents }, resource, accessProps, hasAdminRule = false, onCloseCb) {
    let RightsModal = require('../components/access/AccessModal').default;
    const { readOnly, isAdmin } = accessProps;
    renderModaltoBody(RightsModal, {
      object,
      parents,
      resource,
      readOnly,
      isAdmin,
      hasAdminRule,
      onOk: onCloseCb
    })
  },

  openViewFieldRightsModal(
    rule,
    index,
    object,
    basePrivilege,
    onSaveCb,
    onCloseCb
  ) {
    let FieldRightsModal = require('../components/access/FieldRightsModal').default;
    renderModaltoBody(FieldRightsModal, {
      rule,
      index,
      object,
      basePrivilege
    }, {
        css: 'access-modal'
      }, false, onSaveCb, onCloseCb);
  },

  openViewAccessModal(view, readOnly, onCloseCb) {
    let object = { viewId: view.get('id') };
    const catalogId = view.get('catalogId');
    let parents = [{
      sectionId: appState.getIn(['catalogs', catalogId, 'sectionId'])
    }, {
      catalogId: catalogId
    }];

    this.openAccessModal({ object, parents }, RESOURCE_TYPES.VIEW, { readOnly }, false, onCloseCb);
  },

  openRecordModal(catalogId, recordId, recordName, allowClose = true) {
    let RecordModal = require('../components/App/AppBody/Section/SectionBody/Catalog/Record/RecordModal').default;
    // let mode = appState.getIn(['mode']);

    recordActions.openLinkedRecordModal(catalogId, recordId);

    _openRecordModal(RecordModal, catalogId, recordId, recordName, { allowClose })
  },

  /**
   * Open modal create related record
   * @param catalogId
   * @param linkedRecord {Object<catalog, record>} record to link with
   * @param options {Object}
   */
  openRelatedRecordCreate(catalogId, linkedRecord, options = {}) {
    let { allowClose = true, onCreate } = options;
    let newRecordId = guid.raw();
    let RecordModalCreate = require('../components/App/AppBody/Section/SectionBody/Catalog/Record/RecordModalCreate').default;

    recordActions.generateNewRecord(catalogId, newRecordId, linkedRecord);

    _openRecordModal(RecordModalCreate, catalogId, newRecordId, '', { allowClose, onCreate })
  },

  openLinkedRecordCreate(catalogId, options = {}) {
    let { allowClose = true, onCreate } = options;
    let newRecordId = guid.raw();
    let RecordModalCreate = require('../components/App/AppBody/Section/SectionBody/Catalog/Record/RecordModalCreate').default;

    // если надо открыть уже существующую новую строку, то тут надо найти ее в appState и передать в попап и не вызывать экшны
    recordActions.generateNewRecord(catalogId, newRecordId);
    //apiActions.getFields(catalogId);

    _openRecordModal(RecordModalCreate, catalogId, newRecordId, '', { allowClose, onCreate })
  },

  openViewInputModal(catalogId, accessOnViewForRights) {
    renderModaltoBody(ViewInputModal, {
      isNew: true,
      headerText: trs('modals.createNewView.headerText'),
      onSave: (params) => viewsActions.createNewView(catalogId, params),
      disabledChangeType: !accessOnViewForRights
    });
  },

  openViewInputModalEdit(currView, catalogId) {
    renderModaltoBody(ViewInputModal, {
      isNew: false,
      headerText: trs('modals.editNewView.headerText'),
      name: currView.get('name'),
      originName: currView.get('originName'),
      rights: currView.get('forRights'),
      onOk: (params) => {
        apiActions.updateView({
          catalogId,
          viewId: currView.get('id'),
          forRights: currView.get('forRights')
        }, params);
      }
    });
  }
});


export default ModalStore;
