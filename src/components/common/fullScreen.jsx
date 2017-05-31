import React from 'react';
import miniFullScreen from 'mini-fullscreen';

export default function fullScreen(Component) {
  const FullScreenContainer = React.createClass({
    getInitialState() {
      return {
        start: this.getRunFn('start'),
        stop: this.getRunFn('stop'),
        toggle: this.getRunFn('toggle'),
        enabled: miniFullScreen.getEnabled(),
        active: miniFullScreen.getActive()
      };
    },

    componentDidMount() {
      miniFullScreen.on('change', () => {
        this.setState({
          active: miniFullScreen.getActive()
        });
      });
      this._deferRun && this._deferRun();
    },

    _run(fn) {
      miniFullScreen[fn](this.node);
    },

    getRunFn(fn) {
      return () => {
        if (this.node) {
          this._run(fn);
        } else {
          this._deferRun = () => {
            this._run(fn);
          }
        }
      }
    },

    render() {
      return (
        <div ref={node => this.node = node} style={{width: '100%', height: '100%'}}>
          <Component {...this.props} fullScreen={this.state}/>
        </div>
      );
    }
  });

  return FullScreenContainer;
}
