import React, {Component} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import moment from 'moment';

export default class Timer extends Component {
  state = {};
  shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

  componentWillMount() {
    this.startUpdateDuration();
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  componentWillReceiveProps({nextTime}) {
    if (nextTime !== this.props.nextTime) {
      this.startUpdateDuration(nextTime);
    }
  }

  startUpdateDuration(nextTime = this.props.nextTime) {
    if (!nextTime) {
      return;
    }

    const duration = Math.max(nextTime - Date.now(), 0);

    this.setState({
      duration
    });

    clearTimeout(this.timer);
    if (duration) {
      this.timer = setTimeout(
        this.startUpdateDuration.bind(this),
        Math.min(duration, 1000)
      );
    } else {
      const {onAlarm} = this.props;
      if (onAlarm) {
        onAlarm();
      }
    }
  }

  render() {
    const {duration} = this.state;
    const {format} = this.props;

    return (
      <span>{moment(duration).format(format || 'm:ss')}</span>
    );
  }
}
