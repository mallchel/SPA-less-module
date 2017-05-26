import React from 'react'
import _ from 'lodash'
import $ from 'jquery'
import Immutable from 'immutable'
import Reflux from 'reflux'
import ReactDOM from 'react-dom'
import raf from 'raf'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import UserSettingsStore from '../../../../../../../../../stores/UserSettingsStore'
import recordActions from '../../../../../../../../../actions/recordActions'
import appActions from '../../../../../../../../../actions/appActions'
import FIELD_TYPES from '../../../../../../../../../configs/fieldTypes'
import RecordsHeader from './RecordsHeader'
import RecordsBody from './RecordsBody'

const TABLE_FIELD_WIDTH = 230;
// const FIRST_FIELD_WIDTH = 57;

const WIDTH = {
  [FIELD_TYPES.DATE]: 120,
  [FIELD_TYPES.PROGRESS]: 120,
  [FIELD_TYPES.STARS]: 119,
  [FIELD_TYPES.NUMBER]: 120
};

const Records = React.createClass({
  mixins: [Reflux.listenTo(UserSettingsStore, "onUserSettings")],
  propTypes: {
    catalog: React.PropTypes.object,
    // recordColumnOpen: React.PropTypes.bool
  },

  getInitialState() {
    return {
      allColumnsWidth: 0,
      width: 0,
      dataVisible: false,
      fieldsWidth: new Immutable.Map({}),
      fieldsToRender: new Immutable.List([]),
      moving: false,
      currentX: 0,
      initialX: 0,
      mouseUp: false
    };
  },

  // refactor
  onUserSettings(store, state) {
    // update user settings visible for FieldConfigItem.
    this.setState({ userSettingsState: state });
  },

  setWidth(koef = 1) {
    if (!this.refs.node)
      return;
    let w = $(ReactDOM.findDOMNode(this.refs.node)).width() * koef;
    // log('set width', w, koef, w*koef);


    let catalog = this.props.catalog;
    let catalogId = catalog.get('id');

    if (!(catalog && catalog.get('fields'))) {
      return;
    }

    // set ordering by default.
    let fieldsOrderUSettings = UserSettingsStore.getFieldsOrder({ catalogId }, []);

    let fields = catalog.get('fields').map(field => {
      // get index from collection
      let index = fieldsOrderUSettings.indexOf(field.get('id'));
      field = field.set('_order', (index !== -1) ? index : 9999); //
      return field;
    });
    // apply orderFields from user settings.
    fields = fields.sort((f1, f2) => f1.get('_order') - f2.get('_order'));

    let fieldsWidth = new Immutable.Map();
    let fieldsToRender = new Immutable.List();
    // let widthSum = FIRST_FIELD_WIDTH;
    fields.forEach(field => {
      let type = field.get('type');
      let w = WIDTH[type] || TABLE_FIELD_WIDTH;

      let colId = field.get('id');
      let visible = UserSettingsStore.getVisibilityField({
        fieldId: colId,
        catalogId: catalogId
      }, true);

      if (!visible || type === FIELD_TYPES.GROUP) {
        return;
      }

      // widthSum += w;

      fieldsToRender = fieldsToRender.push(field);
      w = UserSettingsStore.getWidthsRecords({ catalogId, fieldId: colId }, w);
      fieldsWidth = fieldsWidth.set(field.get('id'), w);
    });

    let newState = {};

    if (w !== this.state.width) {
      //newState.width = w;
    }

    if (!fieldsWidth.equals(this.state.fieldsWidth)) {
      newState.fieldsWidth = fieldsWidth;
    }

    if (!fieldsToRender.equals(this.state.fieldsToRender)) {
      newState.fieldsToRender = fieldsToRender;
    }

    if (Object.keys(newState).length !== 0) {
      this.setState(newState);
    }

  },

  startInitialCatalogLoadingTimer() {
    this.showTimer = setTimeout(() => {
      this.setState({
        dataVisible: true
      });
    }, 300);
  },

  componentDidUpdate(prevProps, prevState) {
    //log('update', this.state.fieldsWidth === prevState.fieldsWidth, this.state.fieldsToRender === prevState.fieldsToRender);
    raf(() => {
      this.setWidth();
    });
  },

  componentDidMount() {
    recordActions.requestForRecords(this.catalogId()); // todo +viewId.

    this.setWidth();
    setTimeout(this.setWidth, 1);
    this.setWidthDebounced = _.debounce(() => this.setWidth(), 300);
    $(window).on('resize', this.setWidthDebounced);
    this.startInitialCatalogLoadingTimer();
    $('body')
      .on('mouseup.Records touchend.Records', this.onMouseUp)
      .on('mousemove touchmove', this.onMouseMove);
    $('.list-data').on('touchstart', this.onMouseDown);
  },

  componentWillUnmount() {
    clearTimeout(this.showTimer);
    $(window).off('resize', this.setWidthDebounced);
    $('body').unbind('mouseup touchend', this.onMouseUp).unbind('mousedown touchstart', this.onMouseDown);
    $('.list-data').unbind('touchstart', this.onMouseDown);
  },

  catalogId(catalog = this.props.catalog) {
    return catalog && catalog.get('id');
  },

  componentWillReceiveProps(nextProps) {
    // if (this.props.recordColumnOpen !== nextProps.recordColumnOpen) {
    //   this.setWidth(nextProps.recordColumnOpen ? 0.65 : 1.53);
    // }

    if (this.catalogId() !== this.catalogId(nextProps.catalog)) {
      this.setState({
        dataVisible: false
      });
      this.startInitialCatalogLoadingTimer();
    }

    // this.setState({
    //   currentX: 0,
    //   initialX: 0
    // });
  },

  onMouseDown(event) {
    let targetName = event.target.localName;
    let allColsWidth = $('.grid table').outerWidth();
    let clientX = 0;

    switch (event.type) {
      case "touchstart":
        clientX = event.originalEvent.touches[0].clientX;
        break;
      default:
        clientX = event.clientX;
        break;
    }

    if (allColsWidth > this.state.width) {
      this.setState({
        moving: targetName !== 'span' && targetName !== 'a',
        initialX: clientX,
        currentX: clientX,
        mouseUp: false,
        allColumnsWidth: allColsWidth
      });
    }
  },

  onMouseMove(event) {
    let condition = false;
    let clientX = 0;

    switch (event.type) {
      case "touchmove":
        clientX = event.originalEvent.touches[0].clientX;
        condition = true;
        break;
      default:
        clientX = event.clientX;
        condition = event.buttons;
        break;
    }

    if (this.state.moving && condition) {
      appActions.startDragging();
      this.setState({
        currentX: clientX
      });
    }
  },

  onMouseUp(event) {
    appActions.stopDragging();
    this.setState({
      moving: false,
      mouseUp: true
    });
  },

  updateInitialX() {
    if (this.state.moving) {
      this.setState({
        initialX: this.state.currentX
      });
    }
  },

  onClick(e) {
    var selection = window.getSelection().toString();

    if (!_.isEmpty(selection)) {
      e.stopPropagation();
    }
  },

  render() {
    console.log(1313)
    let catalog = this.props.catalog,
      header,
      body;
    // dataLoading;

    if (catalog) {
      header = <RecordsHeader
        catalog={catalog}
        fieldsWidth={this.state.fieldsWidth}
        fieldsToRender={this.state.fieldsToRender}
        mouseUp={this.state.mouseUp}
        leftOffset={this.state.currentX - this.state.initialX}
      />;

      let loading = (!this.state.dataVisible || catalog.get('fields').size === 0 || catalog.get('loading'));
      body = (
        <RecordsBody
          catalog={catalog}
          fieldsToRender={this.state.fieldsToRender}
          fieldsWidth={this.state.fieldsWidth}
          mouseUp={this.state.mouseUp}
          updateInitialX={this.updateInitialX}
          loading={loading}
          onMouseDown={this.onMouseDown}
          onMouseMove={this.onMouseMove}
        />
      );
    }

    let classNames = 'grid';

    if (this.state.moving) {
      classNames += ' moving';
    }

    return (
      <div
        ref="node"
        className={classNames}
        onClickCapture={this.onClick}>

        {header}
        {body}
      </div>
    );
  }

});

export default Records;
