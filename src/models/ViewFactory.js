import trs from '../getTranslations';
import _ from 'lodash';
import Immutable from 'immutable';

export default {
  create(data = {}) {
    var view = {};
    view.__name = 'View';

    view.uuid = Math.random();
    view.id = data.id != null ? String(data.id) : null;
    view.index = data.index;
    view.name = data.name;
    view.originName = data.originName;
    view.forRights = data.forRights;
    view.privilegeCode = data.privilegeCode;
    view.fieldPrivilegeCodes = data.fieldPrivilegeCodes || {};
    view.c = data.privilegeCode;

    view.catalogId = data.catalogId;

    if (_.isEmpty(data)) {
      view.isNew = true;
    }

    view.filters = view.filters || [];

    return Immutable.fromJS(view);
  }
};
