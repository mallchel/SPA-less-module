import _ from 'lodash'
import debug from 'debug'
import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Immutable from 'immutable'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Responsive, WidthProvider } from 'react-grid-layout'

import reportsActions from '../../../actions/reports'
import appActions from '../../../actions/appActions'
import Loading from '../../common/Loading'
import { base } from '../../common/Modal'

import Widget from './widget'
import AddWidget from './addWidget'
import EditWidgetPopup from './popup/edit'
import canEditBoard from '../canEditBoard'

import { XS_WIDTH, XXS_WIDTH, SM_WIDTH, MD_WIDTH } from '../../../configs/reports/colsWidth'
import { ADD_WIDGET } from '../../../configs/reports/widget/types'

const ResponsiveReactGridLayout = Responsive;

const COLS_WIDTH = { lg: 1440, md: 1440, sm: 1200, xs: 600, xxs: 0 };
const COLS = { lg: MD_WIDTH, md: MD_WIDTH, sm: SM_WIDTH, xs: XS_WIDTH, xxs: XXS_WIDTH };

const Board = React.createClass({
  mixins: [PureRenderMixin],

  getInitialState() {
    return {
      dragging: false,
      moving: false,
      readonly: this.getReadonlyFlag()
    };
  },

  propTypes: {
    board: ImmutablePropTypes.map.isRequired
  },

  onGridChange(gridLayout, grid) {
    this.saveGrid(grid);
    // todo clear update interval to don't update board while user move widgets
  },

  componentWillReceiveProps(nextProps) {
    const { board: prevBoard, catalog: prevCatalog } = this.props;
    const { board: nextBoard, catalog: nextCatalog } = nextProps;

    if (prevBoard.get('id') != nextBoard.get('id')) {
      this.load(nextBoard);
    }

    if (prevCatalog.get('privilegeCode') != nextCatalog.get('privilegeCode')) {
      this.setState({
        readonly: this.getReadonlyFlag(nextCatalog)
      });
    }
  },

  load(board = this.props.board) {
    const boardId = board.get('id');
    reportsActions.getBoardWithWidgets(boardId);
  },

  saveGrid(grid) {
    if (this.state.readonly) {
      return;
    }

    const { board } = this.props;
    const boardId = board.get('id');
    reportsActions.updateBoardGrid(boardId, grid);
  },

  getReadonlyFlag(catalog = this.props.catalog) {
    return !canEditBoard(catalog);
  },

  componentDidMount() {
    this.load();
  },

  _onDragStart(props = {}) {
    this.setState({
      dragging: true,
      ...props
    });
    appActions.startDragging();
  },

  onDragStart(e) {
    this._onDragStart();
  },

  onMoveStart(e) {
    this._onDragStart({ moving: true });
  },

  onDragStop(e) {
    setTimeout(() => {
      this.setState({
        dragging: false,
        moving: false
      })
    }, 100);
    appActions.stopDragging();
  },

  render() {
    const { catalog, board, modules, fullScreen, width } = this.props;
    const { readonly, dragging, moving } = this.state;

    const widgets = board.getIn(['widgets', 'list']) || Immutable.List();
    const loadingWidgets = board.getIn(['widgets', 'loading'], true) && !widgets.size;
    const loadingBoard = board.get('loading') && !board.get('loaded');

    const license = this.props.modules.findIndex(code => code === 'reports') > -1 ? {} : null;

    if (loadingWidgets || loadingBoard) {
      return (
        <Loading />
      );
    }

    const notEditable = readonly || dragging || fullScreen.active;

    let widgetsComponents = widgets.toArray().map(widget => {
      return (
        <div key={widget.get('uid')}>
          <Widget {...{ widget, catalog, board, readonly, editable: !notEditable, moving, license }} />
        </div>
      );
    });

    if (!notEditable) {
      const widgetLayout = {
        x: 0,
        y: Infinity,
        w: width >= COLS_WIDTH.sm ? 4 : 1,
        h: 1,
        isResizable: false
      };

      widgetsComponents.push(
        // in props no catalog because modal component not get changes on catalog changed
        <div key={ADD_WIDGET} data-grid={widgetLayout}>
          <AddWidget onClick={() => base(EditWidgetPopup, { catalog, board, license })} />
        </div>
      );
    }

    // default
    // const margin = [15, 15];
    // const containerPadding = [10, 10];
    // const rowHeight = 60;

    // white theme
    // Margin between items [x, y] in px.
    const margin = [30, 30];
    // Padding inside the container [x, y] in px
    const containerPadding = [10, 10];
    const rowHeight = 50;

    return (
      <div className={this.props.className}>
        <ResponsiveReactGridLayout
          className='widgets-area'
          width={width}
          layouts={board.get('grid').toJS()}
          margin={margin}
          containerPadding={containerPadding}
          breakpoints={COLS_WIDTH}
          cols={COLS}
          rowHeight={rowHeight}
          onLayoutChange={this.onGridChange}
          isDraggable={!readonly}
          isResizable={!readonly}
          onDragStart={this.onMoveStart}
          onResizeStart={this.onDragStart}
          onDragStop={this.onDragStop}
          onResizeStop={this.onDragStop}
          draggableHandle='.widget-header'
          // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
          // and set `measureBeforeMount={true}`.
          useCSSTransforms={board.getIn(['widgets', 'loaded'], false)}
        >
          {widgetsComponents}
        </ResponsiveReactGridLayout>
      </div>
    );
  }
});

export default WidthProvider(Board);
