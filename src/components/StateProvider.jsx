import React from 'react'
import _ from 'lodash'
import Reflux from 'reflux'
import PropTypes from 'prop-types'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { withRouter } from 'react-router'
import appState from '../appState'

const StateProvider = React.createClass({

  mixins: [Reflux.listenTo(appState, 'onAppStateChange')],

  propTypes: {
    componentProps: PropTypes.object
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

export function connect(Component, keys, mapProps = p => p) {
  const Pure = withRouter(React.createClass({
    mixins: [PureRenderMixin],
    render() {
      return <Component {...this.props} />
    }
  }))

  function Connector({ appState, ...props }) {
    const componentProps = keys
      ? _(keys).mapKeys(key => key).mapValues(key => appState.getIn([].concat(key))).value()
      : { appState }
    return <Pure {...componentProps} {...mapProps(props) } />
  }

  return function (props) {
    return (
      <StateProvider component={Connector} componentProps={props} />
    )
  };
}
