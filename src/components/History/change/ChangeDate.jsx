import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import DateField from '../../common/dataTypes/DateField';

const ChangeDate = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    change: React.PropTypes.object.isRequired,
    isNewRecord: React.PropTypes.bool
  },

  render() {
    let oldClass = null;
    if (!this.props.change.get('newValue') && this.props.change.get('oldValue')) {
      oldClass = 'removed';
    }
    return (
      <span>
        <span className={oldClass}>
          <DateField value={this.props.change.get('oldValue')} config={this.props.config} />
        </span>
        {(this.props.change.get('newValue') && this.props.change.get('oldValue'))?<span className="change-direction icon icon--arrows-linear-big-2-01" />:null}
        <span>
          <DateField value={this.props.change.get('newValue')} config={this.props.config} />
        </span>
      </span>
    );
  }

});

export default ChangeDate;
