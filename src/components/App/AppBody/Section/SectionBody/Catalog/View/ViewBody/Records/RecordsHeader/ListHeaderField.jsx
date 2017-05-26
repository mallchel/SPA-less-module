import React from 'react'
import $ from 'jquery'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import _ from 'lodash'
import PropTypes from 'prop-types'
import userSettingsActions from '../../../../../../../../../../actions/userSettingsActions'

const ListHeaderField = React.createClass({
  propTypes: {
    fieldId: PropTypes.string,
    catalogId: PropTypes.string,
    width: PropTypes.number,
    text: PropTypes.string.isRequired,
    sorting: PropTypes.number.isRequired,
    onChangeSorting: PropTypes.func
  },

  componentDidMount() {
    $('body')
      .on('mousemove.col-resize', _.bind(this.onMouseMove, this))
      .on('mouseup.col-resize', _.bind(this.onMouseUp, this));
  },

  componentWillUnmount() {
    $('body')
      .unbind('mousemove.col-resize', this.onMouseMove)
      .unbind('mouseup.col-resize', this.onMouseUp);
  },

  componentWillMount(){
    this.startX = 0;
    this.startColWidth = 0;
    this.colNum = 0;
    this.resizing = false;
    this.rows = [];
    this.headerCnt = undefined;
  },

  getInitialState() {
    return {
      sorting: this.props.sorting
    };
  },

  onClick() {
    if ( this.props.onChangeSorting ) {
      this.props.onChangeSorting(this.props.fieldId, this.state.sorting !== 0 ? -1 * this.state.sorting : 1);
    }
  },

  componentWillReceiveProps(nextProps) {
    if ( nextProps.sorting !== this.props.sorting ) {
      this.setState({
        sorting: nextProps.sorting
      });
    }
  },

  onMouseDown(e) {
    e.stopPropagation();
    this.startX = e.clientX;
    this.resizing = true;

    let col = ReactDOM.findDOMNode(this);

    this.startColWidth = col.offsetWidth;
    this.colNum = $(col).index();
    this.rows = $('.list-data tr');
    $('body').addClass('no-select');
  },

  onMouseMove(e) {
    // не понятно зачем, но это мешает аудио-плееру: перестает перематываться
    // e.stopPropagation();
    if (this.resizing) {
      let col = ReactDOM.findDOMNode(this);
      col.style.width = (this.startColWidth + e.clientX - this.startX) + 'px';

      if (!_.isEmpty(this.rows)){
        this.rows.find('td:eq(' + this.colNum +')').css({width: col.style.width});
      }
    }
  },

  onMouseUp(e) {
    // не понятно зачем, но это мешает аудио-плееру: перестает перематываться
    // e.stopPropagation();
    if (this.resizing) {
      //setFieldWidth
      let col = ReactDOM.findDOMNode(this);
      let width = col.offsetWidth;
      let catalogId = this.props.catalogId;
      let fieldId = this.props.fieldId;
      userSettingsActions.setFieldWidth({catalogId, fieldId, width});
    }
    this.resizing = false;
    $('body').removeClass('resizing');
  },

  render() {
    var sortClasses = classNames({
      'icon': true,
      'icon--arrows-triangle-big-1-01': this.props.sorting === -1,
      'icon--arrows-triangle-big-2-01': this.props.sorting === 1
    });

    return (
        <div className="table-header__field" style={{width: this.props.width, display: 'inline-block'}}>
          <span className="table-header__field-name" onClick={this.onClick} title={this.props.text}>
            <span>{this.props.text}</span>
          </span>
          { this.props.sorting !== 0 ? <span className={sortClasses} /> : null }
          <div className="table-header__field-resize" onMouseDown={this.onMouseDown}>
            <div></div>
          </div>
        </div>
    );
  }
});

export default ListHeaderField;
