import React from 'react';

const LoadingSpinner = React.createClass({
  render () {
    return (
      <span className="spin">
        <span className="icon icon--transfers-75 loading__icon"></span>
      </span>);
  }
});

export default LoadingSpinner;