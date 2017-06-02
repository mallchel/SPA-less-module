import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import trs from '../../../../../../../../../getTranslations'
import DebouncedInput from '../../../../../../../../common/DebouncedInput'
import Loading from '../../../../../../../../common/Loading'
import historyActions from '../../../../../../../../../actions/historyActions'
import keys from '../../../../../../../../../configs/keys'

const NewComment = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    recordId: React.PropTypes.string.isRequired,
    catalogId: React.PropTypes.string.isRequired,
  },

  getInitialState() {
    return {
      comment: '',
      sending: false
    };
  },

  onSend() {
    if (this.state.comment && !this.state.sending) {
      this.setState({ sending: true });
      historyActions
        .createComment(this.props.catalogId, this.props.recordId, this.state.comment)
        .then(() => {
          this.setState({
            comment: '',
            sending: false
          })
        });
    }
  },

  onKeyDown(e) {
    //Ctrl + Enter или ⌘ + Enter
    if ((e.ctrlKey || e.metaKey) && e.keyCode === keys.ENTER) {
      e.preventDefault();
      this.onSend();
    }
  },

  onChange(text) {
    this.setState({
      comment: text
    });
  },

  render() {
    let content = null;
    if (this.state.sending) {
      content = <Loading fullHeight={false} />
    } else {
      content = <DebouncedInput
        className="history__new-input"
        placeholder={trs('record.history.commentPlaceholder')}
        onSave={this.onChange}
        onKeyDown={this.onKeyDown}
        value={this.state.comment}
        multiline={true}
      />;
    }
    return (
      <tr className="history__new">
        <td className="history__new-comment  history__item-content">
          {content}
        </td>
        <td className="history__new-send history__item-user-cell">
          <button className="history__new-btn btn" disabled={!this.state.comment} onClick={this.onSend}>
            {trs('record.history.sendComment')}
          </button>
          <span className="history__new-help">Ctrl+Enter</span>
        </td>
      </tr>
    );
  }
});

export default NewComment;
