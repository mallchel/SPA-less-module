import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { formatDate } from '../../../../../../../../../utils/formatDate'

const LinkedRecord = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    record: React.PropTypes.object.isRequired,
    onClickRecord: React.PropTypes.func
  },

  onClickName(e) {
    e.preventDefault();
    this.props.onClickRecord(this.props.record.get('id'), this.props.record.get('title'));
  },

  render() {
    let record = this.props.record;
    return (<tr onClick={this.onClickName} className={'linked-catalog__record unit-list__row'}>
      <td className="linked-catalog__record-index">
        {record.get('id')}
      </td>
      <td className="linked-catalog__record-name">
        {record.get('title')}
      </td>
      <td className="linked-catalog__record-date">
        <small>
          {formatDate(record.get('created'))}
        </small>
      </td>
    </tr>
    );
  }

});

export default LinkedRecord;
