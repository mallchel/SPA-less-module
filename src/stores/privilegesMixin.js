import Immutable from 'immutable';

export default {
  getPrivileges() {
    this.setIn(['privilegeCodesLoading'], true);
    this.changed();
  },

  getPrivilegesCompleted(privileges) {
    let obj = {};

    privileges.forEach(privilegeObj=> {
      let {code, resources} = privilegeObj;

      resources.forEach(resource=> {
        if ( !obj[resource] ) {
          obj[resource] = [];
        }

        obj[resource].push(code);
      });
    });

    this.setIn(['privilegeCodesLoading'], false);
    this.setIn(['privilegeCodesLoaded'], true);
    this.setIn(['privilegeCodesByResource'], Immutable.fromJS(obj));
    this.changed();
  }
}
