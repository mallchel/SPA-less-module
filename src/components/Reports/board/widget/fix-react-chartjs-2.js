import RC from 'react-chartjs-2';

const componentWillUnmount = RC.prototype.componentWillUnmount;

RC.prototype.componentWillUnmount = function (...args) {
  try {
    // it's method sometimes crashes
    componentWillUnmount.call(this, ...args);
  } catch (e) {
    console.warn('react-chartjs unmount error', e);
  }
};
