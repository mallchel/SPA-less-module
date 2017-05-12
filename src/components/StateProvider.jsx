import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Reflux from 'reflux';
import appState from '../appState';

const StateProvider = React.createClass({

  mixins: [Reflux.listenTo(appState, 'onAppStateChange')],

  propTypes: {
    componentProps: React.PropTypes.object
  },

  onAppStateChange(state) {
    this.setState({
      appState: state
    });
  },

  getInitialState() {
    return {
      appState: appState.getState()
    };
  },

  render() {
    return <this.props.component appState={this.state.appState} {...(this.props.componentProps || {}) } />
  }

});

export default StateProvider;
