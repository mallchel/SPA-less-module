import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import UserField from '../../common/dataTypes/UserField';
import SingleUserField from '../../common/dataTypes/SingleUserField';
import ChangeDirection from './ChangeDirection';

const ChangeUser = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    change: React.PropTypes.object.isRequired,
    isNewRecord: React.PropTypes.bool
  },

  render() {
    let oldUsers = this.props.change.get('oldValue');
    let newUsers = this.props.change.get('newValue');

    //Фильтрация дубликатов
    let newUsersList = newUsers.filter((user) => {
      return !oldUsers.find((testUser) => user.get('id') == testUser.get('id'));
    });
    let oldUsersList = oldUsers.filter((user) => {
      return !newUsers.find((testUser) => user.get('id') == testUser.get('id'));
    });

    let isSingle = oldUsers.size == newUsers.size == 1;
    if (isSingle) {
      let fromUser = (oldUsers.first()?<SingleUserField user={oldUsers.first()} />:null);
      let toUser = (newUsers.first()?<SingleUserField user={newUsers.first()} />:null);
      return (<ChangeDirection containerClass={"history__item-content-change-user"} fromObj={fromUser} toObj={toUser} />);
    } else {
      return (
        <div className="history__item-content-change-user">
            <UserField value={newUsersList} />
            <UserField value={oldUsersList} listClassNames='users-list removed' />
        </div>
      );
    }
  }

});

export default ChangeUser;
