import _ from 'lodash'
import cn from 'classnames'
import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import ReactDOM from 'react-dom'
import ImmutablePropTypes from 'react-immutable-proptypes'
import Immutable from 'immutable'
import $ from 'jquery'
import { Row } from 'antd'
import trs from '../../../../getTranslations'
import TextInput from './common/TextInput'
import LinkedItem from '../../../common/LinkedItem'
import ButtonClose from '../../../common/elements/ButtonClose'

import { EMAIL, SITE, PHONE } from '../../../../configs/contactFieldSubTypes'
import styles from './controls.less'

const log = require('debug')('CRM:Component:Record:ContactField');

const emptyContact = Immutable.fromJS({
  contact: '',
  comment: ''
});
const emptyList = Immutable.fromJS([emptyContact]);

const ContactWithComment = React.createClass({
  propTypes: {
    type: React.PropTypes.string.isRequired,
    contactValue: React.PropTypes.string.isRequired,
    commentValue: React.PropTypes.string.isRequired,
    contactChangeFn: React.PropTypes.func.isRequired,
    commentChangeFn: React.PropTypes.func.isRequired,
    readOnly: React.PropTypes.bool,
    error: React.PropTypes.string
  },

  manageFocusMixin: {
    onFocus: function () {
      this.setState({ inFocus: true })
    },
    onBlur: function () {
      this.setState({ inFocus: false })
    }
  },

  getInitialState() {
    return {
      contactInFocus: false,
      commentInFocus: false,
      index: _.uniqueId(),
      wasFocused: false
    };
  },

  renderPhoneBtn() {
    let phoneRef = this.refs.forOktellBtn;
    let phoneNode = phoneRef && ReactDOM.findDOMNode(phoneRef);

    if (phoneNode) {
      $(phoneNode).oktellButton();
    }
  },

  componentDidMount() {
    this.renderPhoneBtn();
  },

  componentDidUpdate() {
    this.renderPhoneBtn();
  },

  render() {
    let { contactUpdateProcess, commentUpdateProcess, readOnly } = this.props;
    let contact = this.props.contactValue;
    let comment = this.props.commentValue;

    let action = null;
    let withComment = true; // comment || ((this.state.contactInFocus || this.state.commentInFocus) && !readOnly);

    let multiLine = true;
    let containerClassesArr = [];
    let phoneBtn = null;

    let contactClassesArr = [];

    if (contact) {
      if (this.props.type === EMAIL) {
        action = (
          <a className="contact-data__action-link"
            href={'mailto:' + _.trim(contact)}
            tabIndex={this.state.index + 3}
          >{trs('record.fields.contact.mailTo')}</a>
        );
      } else if (this.props.type === SITE) {
        let site = _.trim(contact);
        let href;

        if (/^([a-z]+:\/\/|\/\/)/.test(site)) {
          href = site;
        } else {
          href = 'http://' + site;
        }

        action = (
          <a className="contact-data__action-link"
            href={href}
            target="_blank"
            tabIndex={this.state.index + 3}
          >{trs('record.fields.contact.open')}</a>
        );
      }
    }

    if (this.props.type === PHONE) {
      multiLine = false;

      if ($.fn.oktellButton) {
        let number = String(contact).replace(/[- ()]/g, '').replace(/.*?([0-9]+).*$/, '$1').replace(/[^0-9]/g, '');

        if (number) {
          containerClassesArr.push('contact-data--with-phone');
          contactClassesArr.push('contact-data__contact--with-phone-btn');
          phoneBtn = <span className="record-contact__phone-btn" data-phone={number} ref="forOktellBtn" />
        }
      }
    }

    let contactClasses = cn(contactClassesArr, {
      'contact-data__contact--with-comment': withComment,
      'contact-data__contact--with-action': action
    });

    let containerClasses = cn(this.props.className, containerClassesArr, styles.contactWithCommentRow);

    let contactFocusMixin = {
      onFocus: () => this.setState({ contactInFocus: true, wasFocused: true }),
      onBlur: (e) => {
        setTimeout(() => this.isMounted() && this.setState({ contactInFocus: false }), 0);
        this.props.onBlur && this.props.onBlur(e);
      }
    };

    let commentFocusMixin = {
      onFocus: () => this.setState({ commentInFocus: true }),
      onBlur: (e) => {
        this.setState({ commentInFocus: false });
        this.props.onBlur && this.props.onBlur(e);
      }
    };

    let actions = [];

    if (action) {
      actions.push(<span className={styles.contactDataAction}>{action}</span>);
    }

    if (phoneBtn) {
      actions.push(phoneBtn);
    }

    return (
      !'scenario' ?
        <div className={cn(containerClasses)}>
          <TextInput
            id={this.props.id}
            autoFocus={this.props.autoFocus}
            className={contactClasses}
            value={contact}
            onSave={this.props.contactChangeFn}
            multiline={multiLine}
            readOnly={readOnly}
            tabIndex={this.state.index + 1}
            error={this.props.error || null}
            onUpdate={this.props.onUpdate}
            updateProcess={contactUpdateProcess}
            actions={actions}
            {...contactFocusMixin}
          />
          {
            this.state.wasFocused || comment
              ?
              <TextInput
                style={!withComment && { display: 'none' }}
                className={styles.contactComment}
                disableDebounce={true}
                value={comment}
                onSave={this.props.commentChangeFn}
                multiline={true}
                readOnly={readOnly}
                placeholder={trs('record.fields.contact.commentPlaceHolder')}
                tabIndex={this.state.index + 2}
                onUpdate={this.props.onUpdate}
                updateProcess={commentUpdateProcess}
                {...commentFocusMixin}
              />
              :
              null
          }
        </div>
        :
        <div>
          <TextInput
            id={this.props.id}
            autoFocus={this.props.autoFocus}
            className={contactClasses}
            value={contact}
            onSave={this.props.contactChangeFn}
            multiline={multiLine}
            readOnly={readOnly}
            tabIndex={this.state.index + 1}
            error={this.props.error || null}
            onUpdate={this.props.onUpdate}
            updateProcess={contactUpdateProcess}
            actions={actions}
            {...contactFocusMixin}
          />
          <TextInput
            style={!withComment && { display: 'none' }}
            className={styles.contactComment}
            disableDebounce={true}
            value={comment}
            onSave={this.props.commentChangeFn}
            multiline={true}
            readOnly={readOnly}
            placeholder={trs('record.fields.contact.commentPlaceHolder')}
            tabIndex={this.state.index + 2}
            onUpdate={this.props.onUpdate}
            updateProcess={commentUpdateProcess}
            {...commentFocusMixin}
          />
        </div>
    );
  }
});

const Contact = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    hint: React.PropTypes.string,
    value: ImmutablePropTypes.list,
    config: ImmutablePropTypes.contains({
      type: React.PropTypes.string
    }).isRequired,
    onSave: React.PropTypes.func.isRequired,
    readOnly: React.PropTypes.bool,
    error: React.PropTypes.string,
  },

  getInitialState() {
    return {
      autoFocus: false,
      removed: Immutable.List(),
      newItem: null,
      lastChanged: {
        index: null,
        property: null
      }
    };
  },

  triggerParentSave(value = this.props.value) {
    const newValue = value.toJS();
    this.lastChangedValue = newValue;
    this.props.onSave(newValue);
  },

  onUpdate() {
    this.props.onUpdate(this.lastChangedValue);
  },

  onChangeItem(itemIndex, itemProperty, value) {
    let newValue = this.props.value;
    let newState = {};
    // const controlValue = value;

    if (!newValue || !newValue.get(itemIndex)) {
      if (!newValue) {
        newValue = Immutable.List();
      }
      newValue = newValue.push(emptyContact.set(itemProperty, value));

      _.assign(newState, {
        newItem: null,
        autoFocus: false
      });
    } else {
      newValue = newValue.setIn([itemIndex, itemProperty], value);
    }

    this.setState(_.assign(newState, {
      lastChanged: {
        index: itemIndex,
        property: itemProperty
      }
    }));

    this.triggerParentSave(newValue);
  },

  onRemoveItem(itemIndex) {
    log('remove item', itemIndex);

    const { value } = this.props;
    const size = value && value.size || 0;
    if (itemIndex >= size) {
      this.setState({
        newItem: null,
        autoFocus: false
      });
      return;
    }

    const removeItem = value && value.get(itemIndex);
    const contact = removeItem.getIn(['contact']);
    const comment = removeItem.getIn(['comment']);
    const newValue = value.remove(itemIndex);
    let removed = this.state.removed;

    if (contact || comment) {
      removed = removed.unshift(removeItem);
    }

    this.setState({
      removed,
      lastChanged: {
        index: 0,
        property: 'contact'
      }
    });

    this.triggerParentSave(newValue);
    this.onUpdate(newValue);
  },

  onRestoreItem(itemIndex) {
    this.setState({
      autoFocus: true,
    }, () => {
      let item = this.state.removed.get(itemIndex);
      let newValue = this.props.value.push(item);
      this.setState({
        value: newValue,
        removed: this.state.removed.remove(itemIndex),
        lastChanged: {
          index: newValue.size - 1,
          property: 'contact'
        }
      });
      this.triggerParentSave(newValue);
      this.onUpdate(newValue);
    });
  },

  onItemAdd() {
    log('add item');
    this.setState({
      newItem: emptyContact,
      autoFocus: true
    });
  },

  render() {
    const { updateProcess, readOnly } = this.props;
    const type = this.props.config.get('type');

    const size = this.props.value.size;
    let value = size !== 0 ? this.props.value : emptyList;

    let { newItem, lastChanged } = this.state;

    if (newItem) {
      value = value.push(newItem);
    }

    let changedIndex = lastChanged.index;
    let changedProperty = lastChanged.property;

    if (changedIndex >= size) {
      changedIndex = 0;
      changedProperty = 'contact';
    }

    const exists = value.map((item, index) => {
      return (
        <li className={styles.contactItem} key={index}>
          <Row type="flex">
            <ContactWithComment
              scenario
              id={this.props.htmlId}
              autoFocus={this.state.autoFocus}
              type={type}
              contactValue={item.get('contact') || ''}
              commentValue={item.get('comment') || ''}
              contactChangeFn={value => this.onChangeItem(index, 'contact', value)}
              commentChangeFn={value => this.onChangeItem(index, 'comment', value)}
              readOnly={readOnly}
              onUpdate={this.onUpdate}
              contactUpdateProcess={changedIndex === index && changedProperty === 'contact' && updateProcess}
              commentUpdateProcess={changedIndex === index && changedProperty === 'comment' && updateProcess}
              error={this.props.error || null}
            />
            {
              !readOnly && !!size &&
              <ButtonClose
                title={trs('record.fields.contact.removeBtnTitle')}
                onClick={() => this.onRemoveItem(index)}
                small
              />
            }
          </Row>
        </li>
      );
    });

    const removed = this.state.removed.map((item, index) => {
      return (
        <li className={styles.contactRestoreItem} key={index}>
          <div className={styles.contactRestore}>
            <span
              className={styles.contactRestoreText}
              title={item.get('comment') || item.get('contact')}>
              {item.get('contact') || item.get('comment')}
            </span>&nbsp;
            <LinkedItem
              onClick={() => this.onRestoreItem(index)}
              item={{
                text: trs('record.fields.contact.restore')
              }}
            />
          </div>
        </li>
      );
    });

    return (
      <div>
        <ul className="record__contacts">
          {exists}
          {removed}
        </ul>

        {
          !readOnly && !newItem &&
          <LinkedItem
            onClick={() => this.onItemAdd()}
            item={{
              icon: 'interface-69',
              text: trs('record.addBtn')
            }}
          />
        }
      </div>
    );
  }
});

export default Contact;
