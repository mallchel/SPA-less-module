import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import cx from 'classnames'
import { Link } from 'react-router-dom'

import trs from '../../../getTranslations'

import Timer from './timer'
import canEditBoard from '../canEditBoard'
import router from '../../../router'
import apiActions from '../../../actions/apiActions'
import DefaultRedirect from '../../common/router/DefaultRedirect'
import routes from '../../../routes'
import NavLink from '../../common/router/Link'

const HeaderBoard = React.createClass({
  mixins: [PureRenderMixin],

  onClick() {
    const { board } = this.props;
    router.go(null, { boardId: board.get('id') });
  },

  render() {
    const { board, selected } = this.props;

    let name = board.get('name');

    if (!name) {
      if (board.get('viewId')) {
        name = trs('reports.boards.forView');
      } else {
        name = trs('reports.boards.forCatalog');
      }
    }

    return (
      <NavLink route={routes.board} params={{ boardId: board.get('id') }} render={props => {
        return (
          <li
            className={cx('record-dropdown__item', {
              'record-dropdown__item--selected': props.isActive
            })}
          >
            <Link to={props.link}>
              {name}
            </Link>
          </li>
        )
      }} />
    );
  }
});

const Header = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {},

  getInitialState() {
    return {
      boards: this.getSortedBoards()
    };
  },

  getSortedBoards(props = this.props) {
    const { catalog, boards } = props;
    const currentViewId = catalog.get('currentViewId');
    const viewId = currentViewId && currentViewId != '0' ? currentViewId : null;

    const boardArr = boards.toArray();
    const catalogOnlyBoards = boardArr.filter(b => b.get('viewId') == null);
    const viewBoards = viewId
      ? boardArr.filter(b => b.get('viewId') == viewId)
      : [];

    const catalogId = catalog.get('id');

    // workaround: create boards automatically
    // in the future user can create/rename and remove boards,
    // then in future time "automatically create boards" will be removed
    if (catalogId && canEditBoard(catalog)) {
      if (!catalogOnlyBoards.length && !this.creatingForCatalog) {
        this.creatingForCatalog = true;
        apiActions.createBoard({}, {
          catalogId: catalogId
        });
      }

      if (viewId && !viewBoards.length) {
        if (!this.creatingForView) {
          this.creatingForView = {};
        }

        if (!this.creatingForView[viewId]) {
          this.creatingForView[viewId] = true;
          apiActions.createBoard({}, {
            catalogId: catalogId,
            viewId: viewId
          });
        }
      }
    }

    return [...catalogOnlyBoards, ...viewBoards];
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      boards: this.getSortedBoards(nextProps)
    }, () => {
      // this.selectBoard();
    });
  },

  // selectBoard() {
  //   const { boards } = this.state;
  //   const board = boards.find(b => b === this.props.board);
  //   const firstBoard = boards[0];

  //   if (!board && firstBoard) {
  //     router.go('main.section.catalogData.board', { boardId: firstBoard.get('id') }, true);
  //   }
  // },

  componentDidMount() {
    // this.selectBoard();
  },

  render() {
    const { board, fullScreen, catalog } = this.props;
    const { boards } = this.state;

    const catalogName = catalog && catalog.get('name');
    // className for list is record-dropdown, because it demand of Viktor Nikitin

    return (
      <div className={this.props.className + ''}>
        <DefaultRedirect route={routes.board} params='boardId' object={boards[0]} />
        <div className="m-padding-horizontal boards-list">
          {
            fullScreen.active && <b className="boards-list__catalog">{catalogName}</b>
          }
          <ul className="record-dropdown">
            {boards.map(b => <HeaderBoard key={b.get('id')} board={b} selected={b === board} />)}
          </ul>
        </div>
        <ul className="record-dropdown">
          {
            fullScreen.active && <Timer board={board} />
          }
          {
            fullScreen.enabled && (
              <li className={'record-dropdown__item'} onClick={fullScreen.toggle}>
                <span><i className="icon icon--hardware-1 record-dropdown__icon" />{
                  trs('reports.buttons.fullScreen.' + (fullScreen.active ? 'close' : 'open'))
                }</span>
              </li>
            )
          }
        </ul>
      </div>
    );
  }
});

export default Header;
