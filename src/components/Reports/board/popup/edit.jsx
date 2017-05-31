import _ from 'lodash';
import React from 'react';
import Immutable from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import trs from '../../../../getTranslations';

import apiActions from '../../../../actions/apiActions';

import Data from './data';

const WidgetCreate = React.createClass({
  getInitialState() {
    let { widget } = this.props;

    if (widget) {
      // new uid for new chart data not modify in widgets list
      widget = widget.merge({
        uid: _.uniqueId('edit_')
      })
    } else {
      widget = Immutable.Map({
        id: null,
        uid: _.uniqueId('new_')
      })
    }

    widget = widget.set('inEditMode', true);

    return {
      widget
    }
  },

  onChange(obj, newWidget = null) {
    // throughout callback because this.state changed asynchronous after setState()
    // if setState calls in 2 times, second setState get this.state is very old
    this.setState(state => {
      if (newWidget) {
        return {
          widget: newWidget
        }
      }

      return {
        widget: state.widget.mergeDeep(obj)
      }
    });
  },

  onSave() {
    this.props.closeModal();

    let { widget } = this.state;
    const widgetId = widget.get('id');
    const boardId = this.props.board.get('id');

    widget = widget.delete('inEditMode');

    if (widgetId) {
      apiActions.updateWidget(
        { boardId, widgetId },
        widget.delete('uid')
      );
    } else {
      apiActions.createWidget(
        { boardId },
        widget
      );
    }
  },

  onRemove() {
    this.props.closeModal();

    const { widget } = this.state;
    const widgetId = widget.get('id');
    const boardId = this.props.board.get('id');

    apiActions.deleteWidget(
      { boardId, widgetId },
      widget
    );
  },

  onCancel() {
    this.props.dismissModal();
  },

  render() {
    const { license } = this.props;
    const { widget } = this.state;
    const widgetId = widget.get('id');
    const title = widgetId
      ? trs('reports.widget.modals.edit.title')
      : trs('reports.widget.modals.create.title');

    const saveTitle = widgetId
      ? trs('reports.widget.modals.edit.buttons.ok')
      : trs('reports.widget.modals.create.buttons.ok');

    return (
      <div className="modal-window__form widget-edit-modal">
        <header className="modal-window__header widget-edit-modal__header">
          <i className="modal-window__header__close" onClick={this.onCancel} />
          <h2 className="modal-window__header__title">{title}</h2>
        </header>
        <Data {...this.props} widget={widget} onChange={this.onChange} />
        <footer className="modal-window__footer widget-edit-modal__footer">
          <button className="btn" onClick={license && this.onSave} disabled={!license}>{saveTitle}</button>
          {
            license
              ? <a className="m-like-button" onClick={this.onCancel}>{trs('reports.widget.modals.common.buttons.cancel')}</a>
              : <a className="m-like-button" href="https://bpium.ru/price/" target="_blank">{trs('reports.widget.common.messages.noLicenseToSave')}</a>
          }
          {
            widgetId && license &&
            <a className="m-like-button m-text_danger" style={{ float: 'right' }} onClick={this.onRemove}>{trs('reports.widget.modals.common.buttons.remove')}</a>
          }
        </footer>
      </div>
    );
  }
});

export default WidgetCreate
