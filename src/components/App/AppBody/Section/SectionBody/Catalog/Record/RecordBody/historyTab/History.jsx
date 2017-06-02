import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import ReactDOM from 'react-dom'
import $ from 'jquery'

import historyActions from '../../../../../../../../../actions/historyActions'
import HistoryItem from '../../../../../../../../History/HistoryItem'
import NewComment from './NewComment'

const History = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    history: React.PropTypes.object.isRequired,
    fields: React.PropTypes.object.isRequired,
    recordId: React.PropTypes.string,
    catalogId: React.PropTypes.string
  },

  loading(props = this.props) {
    return props.history.get('loading');
  },

  getInitialState() {
    return {
      onBottom: true,
      loading: this.loading()
    };
  },

  scrolltoBottom() {
    var el = ReactDOM.findDOMNode(this.refs.node);
    el.scrollTop = el.scrollHeight;
    this.setState({
      onBottom: true
    });
  },

  onScroll(e) {
    var onBottom = e.target.scrollHeight - e.target.scrollTop - e.target.offsetHeight < 30;
    // log(`onBottom ${onBottom}, scrollTop ${e.target.scrollTop}, scrollHeight ${e.target.scrollHeight}, offsetHeight ${e.target.offsetHeight}`)

    if (onBottom !== this.state.onBottom) {
      this.setState({
        onBottom: onBottom
      });
    }
    if (!this.state.loading && e.target.scrollTop < window.innerHeight * 2) {
      historyActions.loadHistory(this.props.catalogId, this.props.recordId);
    }
  },

  componentDidMount() {
    this.scrolltoBottom();
    $(ReactDOM.findDOMNode(this.refs.node)).on('scroll', this.onScroll);
  },

  componentWillUnmount() {
    $(ReactDOM.findDOMNode(this.refs.node)).off('scroll', this.onScroll);
  },

  componentDidUpdate(prevProps, prevState) {
    if (this.state.onBottom) {
      this.scrolltoBottom();
    } else if (this.loading(prevProps) && !this.loading()) {
      let el = ReactDOM.findDOMNode(this.refs.node);
      let sh = el.scrollHeight;
      if (this.lastScrollHeight < sh) {
        el.scrollTop = el.scrollTop + sh - this.lastScrollHeight;
      }
    }
  },

  componentWillUpdate(nextProps, nextState) {
    var el = ReactDOM.findDOMNode(this.refs.node);
    this.lastScrollHeight = el.scrollHeight;
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      loading: nextProps.loading
    });
  },

  render() {
    let items = this.props.history.get('items');

    return (
      <div ref="node" className="history__wrapper">
        <table className="history__item-table">
          <tbody>
            {items && items.reverse().map((h) =>
              <HistoryItem
                key={h.get('id')}
                item={h}
                fields={this.props.fields}
                catalogId={this.props.catalogId}
                recordId={h.get('recordId')}
              />)}
            <NewComment catalogId={this.props.catalogId} recordId={this.props.recordId} />
          </tbody>
        </table>
      </div>
    );
  }

});

export default History;
