import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { EventEmitter } from 'events'

const FilterItem = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    opened: React.PropTypes.bool.isRequired,
    name: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,
    onDrop: React.PropTypes.func.isRequired,
    currentView: React.PropTypes.object,
    eventHub: React.PropTypes.objectOf(EventEmitter)
  },

  getInitialState() {
    return {
      opened: this.props.opened
    }
  },

  onHeaderClick() {
    this.setState({ opened: true });

    // event hub
    setTimeout(() => this.props.eventHub.emit('open'), 0);
  },

  onClickClose() {
    this.setState({
      opened: false
    });
    this.props.onDrop();
  },

  componentWillReceiveProps(nextProps) {
    let nextCurrentViewId = nextProps.currentView && nextProps.currentView.get('id');
    let currentViewId = this.props.currentView && this.props.currentView.get('id');

    // shouldn't hide filter item.
    if (nextCurrentViewId !== currentViewId && !nextProps.currentView.get('isNew')) {
      this.setState({ opened: nextProps.opened });
    }
  },

  render() {
    let name = this.props.name;
    let header = <div className="filter-item__header" onClick={this.onHeaderClick} title={name}>
      <span className="filter-item__fieldName">{name}</span>
    </div>;

    let control = <div className="filter-item__control">
      <div className="filter-item__control-header">
        <label onClick={this.onClickClose} title={name}>{name}</label>

        <div title="clear" className="filter-item__close" onClick={this.onClickClose}>
          <span className="icon icon--interface-74"></span>
        </div>
      </div>
      <div className="filter-item__control-cnt">
        {this.props.children}
      </div>
    </div>;

    return (
      <div className={'filter-item filter-item--' + this.props.type}>
        {!this.state.opened ? header : control}
      </div>
    );
  }

});

export default FilterItem;
