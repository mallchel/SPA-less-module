import {checkAccessOnObject} from '../../utils/rights';

import resourceTypes from '../../configs/resourceTypes';
import privilegeCodes from '../../configs/privilegeCodes';

export default function (catalog) {
  return checkAccessOnObject(resourceTypes.CATALOG, catalog, privilegeCodes.ADMIN);
}
