import appState from '../appState';


/**
 */
export function getAllAccessOnObject(resource, object) {
  if (!object) return [];

  let privilegeCode = object.get('privilegeCode');
  if (!appState.getIn(['privilegeCodesByResource', resource])) return [];

  let allPrivilegeCodes = appState.getIn(['privilegeCodesByResource', resource]).toJS();
  let inx = allPrivilegeCodes.indexOf(privilegeCode);

  return allPrivilegeCodes.slice(0, inx + 1);
}


export function checkAccessOnObject(resource, object, rights) {
  let _rights = getAllAccessOnObject(resource, object);
  return _rights.indexOf(rights) > -1;
}
