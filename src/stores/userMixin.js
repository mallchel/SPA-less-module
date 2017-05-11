import Immutable from 'immutable';

export default {
  /**
   * Получение пользователя с сервера
   */
  getUserCompleted(data, {userId}) {
    this.set('currentUser', Immutable.fromJS(data));
    this.changed();
  }
};
