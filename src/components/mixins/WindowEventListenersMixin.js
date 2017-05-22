/**
 * ##WindowEventListenersMixin
 * Allow to easily add event listeners for $(window) in React components
 *
 * Example:
 * ```js
 * import React from 'react';
 * import WindowEventListenersMixin from './WindowEventListenersMixin';
 *
 * const MyComponent = React.createClass({
 *   mixins: [WindowEventListenersMixin],
 *   windowEventListeners: {
 *     events: 'scroll resize',
 *     listener() { console.log('onscroll'); },
 *     debounceTime: 150,
 *     debounceOptions: { leading: true }
 *   },
 *   render() {
 *     return (<div />);
 *   }
 * });
 *
 * export default MyComponent;
 * ```
 *
 * Usage:
 * 1. Add mixin to your React class
 *    `mixins: [WindowEventListenersMixin]`
 * 2. Add `windowEventListeners` property to your React class
 *    it should be configuration object or array of configuration objects
 *
 * Required configuration object properties:
 *   `listener` {Function} event listener function, will be called in context of your React class instance
 *   `events`   {String}   one or more space-separated event names ('scroll', 'resize', 'click' etc)
 * Optional configuration object properties:
 *   `debounceTime`    {Number} delay in milliseconds for https://lodash.com/docs#debounce function
 *   `debounceOptions` {Object} options object for https://lodash.com/docs#debounce function
 *   `throttleTime`    {Number} delay in milliseconds for https://lodash.com/docs#throttle function
 *   `throttleOptions` {Object} options object for https://lodash.com/docs#throttle function
 */

const defaultConfig = {
  debounceTime: 0,
  debounceOptions: {},
  throttleTime: 0,
  throttleOptions: {}
};

let $window;

module.exports = {
  componentDidMount: function() {
    this._removeListenerFns = [];

    if ( !$window ) {
      $window = $(window);
    }

    if ( !this.windowEventListeners ) {
      return;
    }

    if ( !_.isArray(this.windowEventListeners) ) {
      this.windowEventListeners = [this.windowEventListeners];
    }

    this.windowEventListeners.forEach((cfg)=> {
      cfg = _.assign({}, defaultConfig, cfg);

      if ( typeof cfg.listener !== 'function' ) {
        throw new Error(`WindowEventListenersMixin: 'listener' is not a function`);
      }
      if ( typeof cfg.events !== 'string' ) {
        throw new Error(`WindowEventListenersMixin: 'events' is not a string`);
      }


      var listener = cfg.listener.bind(this);

      if ( cfg.debounceTime ) {
        listener = _.debounce(listener, cfg.debounceTime, cfg.debounceOptions);
      } else if ( cfg.throttleTime ) {
        listener = _.throttle(listener, cfg.throttleTime, cfg.throttleOptions);
      }

      var events = cfg.events.split(/\s+/);

      events.forEach((eventName)=> {
        $window.on(eventName, listener);
        this._removeListenerFns.push(()=> $window.off(eventName, listener));
      });
    });
  },

  componentWillUnmount: function() {
    this._removeListenerFns.forEach((remover)=> remover());
  }
};
