import React from 'react'
import _ from 'lodash'
import Reflux from 'reflux'
import appState from '../appState'

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

export function connect(Component, keys) {
  function Connector({ appState, ...props }) {
    const componentProps = keys
      ? _(keys).mapKeys(key => key).mapValues(key => appState.getIn([].concat(key))).value()
      : { appState }
    return <Component {...componentProps} {...props} />
  }

  return function (props) {
    return (
      <StateProvider component={Connector} componentProps={props} />
    )
  };
}
