import Immutable from 'immutable';
import trs from '../getTranslations';

export default {
  getFilterKeysCompleted(keys) {
    this.set('filterKeys', Immutable.fromJS({}));

    let list = new Immutable.List(
      keys
        .filter(key => key.match(/DATE$/))
        .map(key => {
          return Immutable.fromJS({
            key,
            value: trs('filter.keys.' + key)
          });
        })
    );
    this.setIn(['filterKeys', 'date_ranges'], list);

    list = new Immutable.List(
      keys
        .filter(key => key.match(/USER$/))
        .map(key => {
          return Immutable.fromJS({
            key,
            value: trs('filter.keys.' + key)
          });
        })
    );
    this.setIn(['filterKeys', 'users'], list);

    this.changed();
  }
}
