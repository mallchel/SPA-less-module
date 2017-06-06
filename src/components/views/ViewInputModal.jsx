import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import ReactDOM from 'react-dom'
import { Modal, Button } from 'antd'

import trs from '../../getTranslations'

const ViewInputModal = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    headerText: React.PropTypes.string,
    value: React.PropTypes.string,
    rights: React.PropTypes.bool,
    onOk: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func,
    closeModal: React.PropTypes.func,
    saveText: React.PropTypes.string,
    disabledChangeType: React.PropTypes.bool
  },

  getInitialState() {
    return {
      name: this.props.name,
      originName: this.props.originName,
      rights: Number(this.props.rights || false)
    };
  },

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  },
  isValid() {
    return (this.props.value !== this.state.name && this.state.name) ||
      (this.props.rights !== Boolean(+this.state.rights) && this.state.name);
  },

  onSave(e) {
    e.preventDefault();
    if (!this.isValid()) {
      return;
    }
    this.props.onOk({
      name: this.state.name,
      originName: this.state.originName,
      forRights: Boolean(+this.state.rights)
    });
    // this.props.dismissModal();
  },

  componentDidMount() {
    let el = ReactDOM.findDOMNode(this.input);
    el.focus();
    el.setSelectionRange(0, el.value.length);
  },

  onSelectRights(e) {
    this.setState({ rights: e.target.value });
  },

  render() {
    let saveButton = null;
    let modalInput = null;
    if (this.state.rights == "1") {
      if (this.props.isNew) {
        saveButton = trs('views.modal.createViewAndSaveAccess');
      } else {
        saveButton = trs('views.modal.saveViewAndSaveAccess');
      }

      modalInput = (
        <div className="rights-data">
          <div className="rights-data__form-element rights-data__form-element-half">
            <label className="rights-data__form-label">
              {trs('rights.originName')}
              <input className="rights-data__form-field"
                type="text"
                value={this.state.originName}
                name="originName"
                onChange={this.onChange}
              />
            </label>
          </div>
          <div className="rights-data__form-element rights-data__form-element-half">
            <label className="rights-data__form-label">
              {trs('rights.name')}
              <span className="record-field__required-asterisk">*</span>
              <input className="rights-data__form-field"
                type="text"
                value={this.state.name}
                name="name"
                required="required"
                ref={node => this.input = node}
                onChange={this.onChange}
              />
            </label>
          </div>
          <div className="clear"></div>
        </div>
      );
    } else {
      if (this.props.isNew) {
        saveButton = trs('buttons.create');
      } else {
        saveButton = trs('buttons.save');
      }

      modalInput = (
        <div className="rights-data">
          <div className="rights-data__form-element">
            <label>
              {trs('views.modal.inputPlaceholder')}
              <span className="record-field__required-asterisk">*</span>
              <input className="rights-data__form-field"
                type="text"
                style={{ width: '100%' }}
                name="name"
                required="required"
                value={this.state.name}
                ref="input"
                onChange={this.onChange} />
            </label>
          </div>
        </div>
      );
    }
    return (
      <Modal
        visible={true}
        maskClosable={false}
        closable={false}
        footer={[
          <Button key="submit" type="primary" size="large" onClick={this.onSave}>{trs('buttons.save')}</Button>,
          <Button key="back" type="default" size="large" onClick={this.props.onCancel}>{trs('buttons.cancel')}</Button>,
        ]}
        width='60%'
      >
        <div className="modal-window__form modal-window__form_view-filters">
          <header className="modal-window__header">
            <i className="modal-window__header__close" onClick={this.props.dismissModal}></i>

            <h2 className="modal-window__header__title">
              {this.props.headerText} <br />
              <small>{trs('views.modal.headerTextSub')}</small>
            </h2>
          </header>
          <div className="modal-window__content">
            <div className="modal-window__content__padding">
              <form onSubmit={this.onSave}>
                {
                  this.props.disabledChangeType ? null : <section className="modal-window__content__rights">
                    <div className="modal-window__content__rights-item">
                      <label className="radio modal-window__content__rights-label">
                        <input name="rights" type="radio" value="1"
                          checked={this.state.rights == "1"}
                          onChange={this.onSelectRights} />
                        <span dangerouslySetInnerHTML={{ __html: trs('views.modal.labelForRigthsView') }} />
                      </label>
                    </div>

                    <div className="modal-window__content__rights-item">
                      <label className="radio modal-window__content__rights-label">
                        <input name="rights" type="radio" value="0"
                          checked={this.state.rights == "0"}
                          onChange={this.onSelectRights} />
                        <span dangerouslySetInnerHTML={{ __html: trs('views.modal.labelForPrivateView') }} />
                      </label>
                    </div>
                  </section>
                }
                {modalInput}

              </form>
            </div>
          </div>
          <footer className="modal-window__footer">
            <button disabled={!this.isValid()} className="btn"
              onClick={this.onSave}>
              {saveButton}
            </button>
            <a className="m-like-button" onClick={this.props.dismissModal}>{trs('buttons.cancel')}</a>
          </footer>
        </div>
      </Modal>
    );
  }
});

export default ViewInputModal;
