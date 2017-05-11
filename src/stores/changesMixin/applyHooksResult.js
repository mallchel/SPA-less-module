import _ from 'lodash'

import { alert } from '../../components/common/Modal'
import trs from '../../getTranslations';

function applyHookResult({message, values}, store, {catalogId, recordId}) {
  if (message) {
    let title;
    if (_.isObject(message)) {
      title = message.title;
      message = message.text;
    }

    alert({
      headerText: title || trs('modals.record.changes.title'),
      text: message,
      okText: trs('modals.record.changes.buttons.ok')
    });
  }

  store.mergeIn(['records', catalogId, recordId, 'values'], values || {});
}

export default function (hooksResults, store, {catalogId, recordId}) {
  _.forEach(hooksResults, hooksResult=> {
    applyHookResult(hooksResult || {}, store, {catalogId, recordId});
  });
}
