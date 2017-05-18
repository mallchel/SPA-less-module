import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ReactDOM from 'react-dom';
import trs from '../../getTranslations';

const InputModal = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    headerText: React.PropTypes.string,
    inputPlaceHolder: React.PropTypes.string,
    value: React.PropTypes.string,
    onSave: React.PropTypes.func,
    dismissModal: React.PropTypes.func,
    closeModal: React.PropTypes.func,
    saveText: React.PropTypes.string
  },

  getInitialState() {
    return {
      value: this.props.value
    };
  },

  onChange(e) {
    this.setState({
      value: e.target.value
    });
  },

  isValid() {
    return this.props.value !== this.state.value && this.state.value;
  },

  onSave(e) {
    e.preventDefault();
    if ( !this.isValid() ) {
      return;
    }
    this.props.onSave(this.state.value);
    this.props.dismissModal();
  },

  componentDidMount() {
    let el = ReactDOM.findDOMNode(this.refs.input);
    el.focus();
    el.setSelectionRange(0, el.value.length);
  },

  render() {
    return (
      <div className="modal-window__form">
        <header className="modal-window__header">
          <i className="modal-window__header__close" onClick={this.props.dismissModal}></i>
          <h2 className="modal-window__header__title">
            {this.props.headerText}
          </h2>
        </header>
        <div className="modal-window__content">
          <div className="modal-window__content__padding">
            <form onSubmit={this.onSave}>
              <input
                className="w100"
                ref="input"
                type="text"
                value={this.state.value}
                onChange={this.onChange}
                placeholder={this.props.inputPlaceHolder}
              />
            </form>
          </div>
        </div>
        <footer className="modal-window__footer">
          <button disabled={!this.isValid()} className="btn" onClick={this.onSave}>{this.props.saveText || trs('buttons.save')}</button>
          <a className="m-like-button" onClick={this.props.dismissModal}>{trs('buttons.cancel')}</a>
        </footer>
      </div>
    );
  }

});

export default InputModal;
