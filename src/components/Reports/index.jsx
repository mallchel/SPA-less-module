import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import PropTypes from 'prop-types'

import apiActions from '../../actions/apiActions'
import Loading from '../common/Loading'
import fullScreen from '../common/fullScreen'
import { connect } from '../StateProvider'
import NavRoute from '../common/router/Route'
import routes from '../../routes'

import Header from './header'
import Board from './board'

const ReportsMainController = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    modules: PropTypes.object,
    boards: PropTypes.object
  },

  componentDidMount() {
    const { catalog } = this.props;
    const catalogId = catalog.get('id');
    apiActions.getBoards({}, { catalogId });
  },

  render() {
    const { catalog, modules, fullScreen, boards: boardsObj } = this.props;
    const catalogId = catalog.get('id');
    const loaded = boardsObj && boardsObj.get('loaded');

    if (!loaded) {
      return (
        <div>
          <Loading />
        </div>
      );
    }

    const boards = boardsObj.get('list').filter(b => b.get('catalogId') == catalogId);

    return (
      <NavRoute route={routes.board}>
        {({ match }) => {
          const { boardId } = match ? match.params : {};
          const board = boards.find(b => b.get('id') == boardId);

          return (
            <div className='reports'>
              <Header className='reports__header' {...{ catalog, boards, board, fullScreen }} />
              {board && <Board className='reports__content' {...{ catalog, board, modules, fullScreen }} />}
            </div>
          )
        }}
      </NavRoute>
    );
  }
});

export default connect(fullScreen(ReportsMainController), ['modules', 'boards']);
