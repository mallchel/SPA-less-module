import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import trs from '../../../getTranslations';
import SingleUserField from './SingleUserField';

const UserField = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    value: React.PropTypes.object.isRequired,
    config: React.PropTypes.object,
    listClassNames: React.PropTypes.string,
    listItemClassNames: React.PropTypes.string,
    isSingle: React.PropTypes.bool
  },

  render() {
    let users = [];
    let listClassNames = this.props.listClassNames || 'users-list';
    let listItemClassNames = this.props.listItemClassNames || '';

    this.props.value.forEach((user)=> {
      users.push(
        <li className={listItemClassNames} key={user.get('id')}>
          <div className="record-user">
            <div className="record-user__items">
              <SingleUserField user={user} />
            </div>
          </div>
        </li>
      );
    });
    return (
      <ul className={listClassNames}>{users}</ul>
    );
  }
});


export default UserField;
