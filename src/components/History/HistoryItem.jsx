import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import classNames from 'classnames'
import trs from '../../getTranslations'
import HistoryItemChange from './HistoryItemChange'
import modalsActions from '../../actions/modalsActions'
import { formatDate, formatTime } from '../../utils/formatDate'
import Items from '../common/dataTypes/Items'
import nl2br from '../../utils/nl2br'

const HistoryItem = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    item: React.PropTypes.object.isRequired,
    fields: React.PropTypes.object.isRequired
  },

  onClickItem(item, e) {
    e.preventDefault();
    e.stopPropagation();
    let {recordId, catalogId, recordTitle} = item.obj.toJS();
    modalsActions.openRecordModal(catalogId, recordId, recordTitle);
  },

  render() {
    let item = this.props.item;
    let classname = classNames('history__item-content', {
      'history__item-content-change' : item.get('actionType') != 'COMMENT',
      'history__item-content-comment' : item.get('actionType') == 'COMMENT'
    });
    let content = null;
    let contentChanges = null;
    switch (item.get('actionType')) {
      case 'COMMENT':
        content = (<div className="history__item-change"><span className="history__item-content-comment-text history__item-change">{nl2br(item.getIn(['payload', 'message']))}</span></div>);
        break;
      case 'DELETE':
        content = (<span className="history__item-content-change-text history__item-change">{trs('record.history.type.delete')}</span>);
        break;
      case 'CREATE':
        content = (<div className="history__item-change"><span className="history__item-content-record-created history__item-change">{trs('record.history.type.create')}</span></div>);
      case 'UPDATE':
        let fields = this.props.fields;
        if (!fields) {
          break;
        }
        contentChanges = fields.map( (field) => {
          const change = item.getIn(['payload', field.get('id')]);
          if (!change) {
            return null;
          }
          return <HistoryItemChange key={field.get('id')} field={field} change={change} isNewRecord={item.get('actionType') == 'CREATE'} />;
        } );

        break;
    }

    let date = new Date(item.get('date'));
    let showTime = date.getFullYear() === (new Date()).getFullYear();

    return (
      <div key={item.get('id')}>
        {this.props.withRecordTitle
          ? (<td className={classname + ' history__item-record-cell'}>
              <Items inContainers={true} onClick={this.onClickItem} values={
              [{
                obj: item,
                name: item.get('recordTitle'),
                color: 'd9d3df',
                onClick: this.onClick
              }]} />
            </td>)
          : null}
        <td className={classname + ' history__item-action-cell'}>
          {content}
          {contentChanges}
        </td>
        <td className="history__item-user-cell">
          <span className="history__item-date" title={formatDate(date, true)}>{formatDate(date)}</span>
          {showTime?<span className="history__item-time">{formatTime(date)}</span>:null}
          <span className="history__item-user">{item.getIn(['user', 'title'])}</span>
        </td>
      </div>
    );

  }

});

export default HistoryItem;
