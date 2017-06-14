import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Modal, Button } from 'antd'
import icons from '../../configs/icons'
import classNames from 'classnames'
import trs from '../../getTranslations'

const Icon = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    select: React.PropTypes.func.isRequired,
    isSelected: React.PropTypes.bool,
    icon: React.PropTypes.string
  },
  onClick() {
    this.props.select(this.props.icon);
  },
  render() {
    return (
      <div className={classNames('icons-modal__icon', { 'icons-modal__icon--selected': this.props.isSelected })} onClick={this.onClick} >
        <div className={'icon icon--' + this.props.icon} />
      </div>
    );
  }
});

const IconsModal = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    header: React.PropTypes.string,
    // closeModal: React.PropTypes.func.isRequired,
    // dismissModal: React.PropTypes.func.isRequired,
    currentIcon: React.PropTypes.string.isRequired,
    onSave: React.PropTypes.func
  },

  getInitialState() {
    return {
      icon: null
    };
  },

  selectIcon(icon) {
    this.setState({
      icon: icon
    });
  },

  save() {
    this.props.onSave(this.state.icon);
    this.props.closeModal();
  },

  render() {
    return (
      <Modal
        visible={true}
        maskClosable={false}
        closable={false}
        footer={[
          <Button key="submit" type="primary" size="large" disabled={!this.state.icon} onClick={this.save}>{trs('modals.save')}</Button>,
          <Button key="back" type="default" size="large" onClick={this.props.onCancel}>{trs('modals.cancel')}</Button>,
        ]}
        width='60%'
      >
        <div className="modal-window__form icons-modal">
          <header className="modal-window__header">
            <i className="modal-window__header__close" onClick={this.props.dismissModal}></i>
            <h2 className="modal-window__header__title">
              <i className={'icon icon--' + this.props.currentIcon} />
              {this.props.header}
            </h2>
          </header>
          <div className="modal-window__content">
            <div className="modal-window__content__padding">
              {icons.map((icon, i) => <Icon key={i} icon={icon} select={this.selectIcon} isSelected={icon === this.state.icon} />)}
            </div>
          </div>
        </div>
      </Modal>
    );
  }

});

export default IconsModal;
