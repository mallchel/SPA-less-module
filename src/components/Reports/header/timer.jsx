import _ from 'lodash'
import React, { Component } from 'react'

import Timer from '../../common/Timer'
import reportsActions from '../../../actions/reports'

const updateInterval = 5 * 60 * 1000; //5 minutes

export default class ReportsHeaderTimer extends Component {
  componentWillMount() {
    this.startUpdate();
  }

  componentWillReceiveProps(nextProps) {
    const { board } = this.props;
    const { board: nextBoard } = nextProps;
    if ((board && board.get('id')) !== (nextBoard && nextBoard.get('id'))) {
      this.startUpdate(nextBoard);
    }
  }

  startUpdate(board = this.props.board) {
    board && reportsActions.updateBoardSystem(board.get('id'), {
      nextUpdate: Date.now() + updateInterval
    });
  }

  update() {
    const { board } = this.props;
    if (board) {
      this.startUpdate();
      reportsActions.getBoardWithWidgets(board.get('id'));
    }
  }

  updateThrottled = _.throttle(() => this.update(), 2000, { leading: true, trailing: false });

  render() {
    const { board } = this.props;
    const nextUpdate = board && board.get('nextUpdate');

    return (
      <li className={'record-dropdown__item'} onClick={this.updateThrottled}>
        <span>
          <i className="icon icon--transfers-74 record-dropdown__icon" />
          <Timer nextTime={nextUpdate} onAlarm={this.updateThrottled} />
        </span>
      </li>
    )
  }
}
