import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import trs from '../../../getTranslations';

const SingleUserField = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    user: React.PropTypes.object.isRequired,
  },
  render () {
    return (
      <span className="record-user__item">
        <span className="icon icon--users-1" />
        <a >{this.props.user && this.props.user.get('title') || trs('emptyUser')}</a>
      </span>
    );
  }
});

export default SingleUserField;
