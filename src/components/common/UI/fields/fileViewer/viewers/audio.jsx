import _ from 'lodash'
import React from 'react'
import ReactDOM from 'react-dom'
import $ from 'jquery'
import trs from '../../../../../../../../../../../../getTranslations'

const log = require('debug')('CRM:Component:AudioViewer');

function isMyFile(file) {
  return /^audio\//.test(file.mimeType);
}

function secToTime(seconds, template = '') {
  if (!seconds) {
    return '';
  }

  let sec = seconds % 60;
  let min = (seconds - sec) / 60;
  let hours = '';

  if (min > 60 || template.length > 5) {
    hours = Math.floor(min / 60) + ':';
    min = min % 60;
  }

  if (hours && min < 10 || template.length > 2) {
    min = '0' + min;
  }

  min = min ? min + ':' : '';

  if (min && sec < 10) {
    sec = '0' + sec;
  }

  return hours + min + sec;
}

const playEvents = 'play playing'.split(' ');
const changePositionEvents = 'timeupdate'.split(' ');
const pauseEvents = 'pause'.split(' ');
const errorEvents = 'error abort'.split(' ');

const handlers = [];
const globalEvents = {
  trigger: id => handlers.forEach(fn => fn(id)),
  on: fn => handlers.push(fn),
  off: fn => _.remove(handlers, handler => fn === handler)
};

const Player = React.createClass({

  getInitialState() {
    this.id = _.uniqueId();
    this.audio = new Audio;

    return {
      playError: false,
      playErrorMessage: null,
      isPlaying: false,

      currentTime: 0,
      totalTime: 0,
      progress: 0
    };
  },

  play() {
    log('play start', this.props.file.id);

    if (!this.audio.src) {
      this.audio.src = this.props.file.url;
    }

    // тормозим другие плееры
    globalEvents.trigger(this.id);

    this.audio.play();
  },

  pause() {
    //log('play pause', this.props.file.id);
    this.audio.pause();
  },

  togglePlay() {
    if (this.state.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  },

  onPlay() {
    log('play onStart', this.props.file.id);

    this.setState({
      playError: false,
      isPlaying: true
    });
  },

  onPause() {
    log('play onPause', this.props.file.id);

    this.setState({
      isPlaying: false
    });
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    return !(_.isEqual(nextProps, this.props) && _.isEqual(nextState, this.state));
  },

  onError() {
    // todo correct handle this event, problem on replay the play

    let error = this.audio.error;
    let errorMsg = '';

    switch (error.code) {
      case error.MEDIA_ERR_ABORTED:
        errorMsg = 'media err aborted';
        break;
      case error.MEDIA_ERR_NETWORK:
        errorMsg = 'media err network';
        break;
      case error.MEDIA_ERR_DECODE:
        errorMsg = 'media err decode';
        break;
      case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
        errorMsg = 'media err src not supported';
        break;
    }

    log('play error', this.props.file.id, error);

    this.setState({
      isPlaying: false,
      playError: true,
      playErrorMessage: errorMsg
    });
  },

  onGlobalPlay(id) {
    if (id !== this.id) {
      this.pause();
    }
  },

  updateTimeInState: _.throttle(function () {
    let currentTime = Math.floor(this.audio.currentTime);
    let totalTime = Math.floor(this.audio.duration);

    this.setState({
      currentTime: currentTime,
      totalTime: totalTime,
      progress: totalTime ? currentTime / totalTime : 0
    });
  }, 100),

  onPositionChange() {
    this.updateTimeInState();
  },

  onBarMouseDown(e) {
    log('bar mouse down - begin seeking of new position');

    let bar = $(ReactDOM.findDOMNode(this.refs.bar));
    this.barWidth = bar.width();
    this.barLeftOffset = bar.offset().left;

    this.pause();

    $(document).on('mousemove.audio-viewer', this.onMouseMove);
    $(document).on('mouseup.audio-viewer', this.onMouseUp);
  },

  getProgress(mouseX) {
    return Math.min(Math.max(mouseX - this.barLeftOffset, 0) / this.barWidth, 1);
  },

  onMouseUp(e) {
    $(document).off('mousemove.audio-viewer', this.onMouseMove);
    $(document).off('mouseup.audio-viewer', this.onMouseUp);

    let progress = this.getProgress(e.pageX);

    if (this.state.totalTime) {
      this.setState({
        progress: progress,
        currentTime: Math.round(this.state.totalTime * progress)
      });
      this.audio.currentTime = this.state.totalTime * progress;
      this.play();
    } else {
      this.setState({
        progress: progress
      });

      this.play();

      // если аудио еще не загружено, подписываемся на собиыте timeupdate именно там появляется длинна аудио
      // после устанавлеваем корректную позицию старта и возвращаем прежний слушатель
      // пс. можно было не сбрасывать текущих подписчиков :)
      let oldHandlers = changePositionEvents.map(event => this.audio['on' + event]);
      changePositionEvents.forEach(event => {
        this.audio['on' + event] = () => {
          if (this.audio.duration) {
            changePositionEvents.forEach((event, i) => this.audio['on' + event] = oldHandlers[i]);
            this.audio.currentTime = this.audio.duration * progress;

          }
        }
      })
    }
  },

  onMouseMove: _.throttle(function (e) {
    this.setState({
      progress: this.getProgress(e.pageX)
    });
  }, 20),

  onRemove() {
    this.props.removeFn(this.props.file);
  },
  componentDidMount() {
    globalEvents.on(this.onGlobalPlay);

    playEvents.forEach(eventName => this.audio['on' + eventName] = this.onPlay);
    pauseEvents.forEach(eventName => this.audio['on' + eventName] = this.onPause);
    errorEvents.forEach(eventName => this.audio['on' + eventName] = this.onError);
    changePositionEvents.forEach(eventName => this.audio['on' + eventName] = this.onPositionChange);
  },

  componentWillUnmount() {
    this.pause();

    globalEvents.off(this.onGlobalPlay);

    playEvents.forEach(eventName => this.audio['on' + eventName] = null);
    pauseEvents.forEach(eventName => this.audio['on' + eventName] = null);
    errorEvents.forEach(eventName => this.audio['on' + eventName] = null);
    changePositionEvents.forEach(eventName => this.audio['on' + eventName] = null);
  },

  render() {
    let totalTimeFormatted = secToTime(this.state.totalTime);
    let currentTimeFormatted = secToTime(this.state.currentTime, totalTimeFormatted);
    let progressFormatted = Math.round(this.state.progress * 10000) / 100 + '%';

    return (
      <div className='audio-player'>
        <span
          className={
            'audio-player__controls icon icon--' + (this.state.isPlaying ? 'multimedia-72' : 'multimedia-73')
            + (this.state.playError ? ' m-text_muted' : '')
          }
          onClick={this.togglePlay}>
        </span>

        <div
          className={'audio-player__title' + (this.state.playError ? ' audio-player__title--error' : '')}
          title={this.props.file.title}>
          <div className='audio-player__file-title'>{this.props.file.title}</div>

          <div className='audio-player__timing'>
            <span className="audio-player__timing-play">{currentTimeFormatted}</span>
            <span className="audio-player__timing-total">{totalTimeFormatted}</span>
          </div>

          {this.state.playError
            ? <span className='audio-player__error m-text_danger' title={this.state.playErrorMessage}>{trs('audioPlayer.error')}</span>
            : null
          }
        </div>

        <a
          href={this.props.file.url} target='_blank'
          className='audio-player__download-btn icon icon--transfers-41'
          title={trs('audioPlayer.download')}>
        </a>

        {this.props.readOnly
          ? null
          : <span title={trs('record.fields.file.remove')} className='m-close audio-player__remove-btn' onClick={this.onRemove} />}

        <div className="jouele">
          <div className="jouele-info-area">
            <div className="jouele-time">
              <div className="jouele-play-time">{currentTimeFormatted}</div>
              <div className="jouele-total-time">{totalTimeFormatted}</div>
            </div>
          </div>
          <div className="jouele-progress-area">
            <div className="jouele-mine" onMouseDown={this.onBarMouseDown} ref="bar">
              <div className="jouele-load-bar" style={{ width: '100%' }}></div>
              <div className="jouele-play-bar" style={{ width: progressFormatted }}></div>
              <div className="jouele-play-lift" style={{ left: progressFormatted }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

const AudioViewer = React.createClass({
  statics: {
    isMyFile
  },
  render() {
    return (
      <div>
        {this.props.files.map((file, i) => {
          return (<Player {...this.props} key={i} file={file} />);
        })}
      </div>
    );
  }
});

export default AudioViewer;
