import _ from 'lodash'
import classNames from 'classnames'
import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import ReactDOM from 'react-dom'
import ImmutablePropTypes from 'react-immutable-proptypes'
import Immutable from 'immutable'
import $ from 'jquery'

import recordActions from '../../../../../../../../../../actions/recordActions'
import trs from '../../../../../../../../../../getTranslations'

import TextInput from './common/TextInput'
import AddBtn from '../addBtn'
import Hint from '../hint'

import { EMAIL, SITE, PHONE } from '../../../../../../../../../../configs/contactFieldSubTypes'

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
      index: _.uniqueId()
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
    let { contactUpdateProcess, commentUpdateProcess } = this.props;
    let contact = this.props.contactValue;
    let comment = this.props.commentValue;

    let action = null;
    let withComment = true; // comment || ((this.state.contactInFocus || this.state.commentInFocus) && !this.props.readOnly);

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

    let contactClasses = classNames('contact-data__contact', contactClassesArr, {
      'contact-data__contact--with-comment': withComment,
      'contact-data__contact--with-action': action
    });

    let containerClasses = classNames(this.props.className, 'contact-data', containerClassesArr);

    let contactFocusMixin = {
      onFocus: () => this.setState({ contactInFocus: true }),
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
      actions.push(<span className="contact-data__action">{action}</span>);
    }

    if (phoneBtn) {
      actions.push(phoneBtn);
    }

    return (
      <div className={containerClasses}>
        <TextInput
          autoFocus={this.props.autoFocus}
          disableDebounce={true}
          wrapperClassName="contact-data__contact-wrapper"
          className={contactClasses}
          value={contact}
          onSave={this.props.contactChangeFn}
          multiline={multiLine}
          rows="1"
          readOnly={this.props.readOnly}
          tabIndex={this.state.index + 1}
          error={this.props.error || null}
          field={this.props.field}
          onUpdate={this.props.onUpdate}
          updateProcess={contactUpdateProcess}
          actions={actions}
          {...contactFocusMixin}
        />
        <TextInput
          wrapperClassName={'contact-data__contact-wrapper' + (withComment ? '' : ' contact-data__comment-wrapper--hidden')}
          className="contact-data__comment"
          disableDebounce={true}
          value={comment}
          onSave={this.props.commentChangeFn}
          multiline={true}
          rows="1"
          readOnly={this.props.readOnly}
          placeholder={trs('record.fields.contact.commentPlaceHolder')}
          tabIndex={this.state.index + 2}
          field={this.props.field}
          onUpdate={this.props.onUpdate}
          updateProcess={commentUpdateProcess}
          {...commentFocusMixin}
        />
      </div>
    );
  }
});

const ContactField = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    hint: React.PropTypes.string,
    value: ImmutablePropTypes.list,
    config: ImmutablePropTypes.contains({
      type: React.PropTypes.string
    }).isRequired,
    onSave: React.PropTypes.func.isRequired,
    disableDebounce: React.PropTypes.bool,
    readOnly: React.PropTypes.bool,
    error: React.PropTypes.string,
    catalogId: React.PropTypes.string,
    recordId: React.PropTypes.string,
    fieldId: React.PropTypes.string,
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

  onChangeItem(itemIndex, itemProperty, itemValue) {
    let newValue = this.props.value;
    let newState = {};

    if (!newValue || !newValue.get(itemIndex)) {
      if (!newValue) {
        newValue = Immutable.List();
      }
      newValue = newValue.push(emptyContact.set(itemProperty, itemValue));

      _.assign(newState, {
        newItem: null,
        autoFocus: false
      });
    } else {
      newValue = newValue.setIn([itemIndex, itemProperty], itemValue);
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

  onBlur(e) {
    let val = e.target.value;
    if (val) {
      recordActions.clearErrorField(this.props.catalogId, this.props.recordId, this.props.fieldId);
    }
  },

  render() {
    let { updateProcess } = this.props;
    let type = this.props.config.get('type');

    let _value = this.props.value;
    let size = _value && _value.size || 0;
    let value = size ? _value : emptyList;

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

    let exists = value.map((item, index) => {
      return (
        <li className="record-contact" key={index}>
          <div>
            <ContactWithComment
              autoFocus={this.state.autoFocus}
              className="record-contact__data"
              type={type}
              contactValue={item.get('contact') || ''}
              commentValue={item.get('comment') || ''}
              contactChangeFn={subValue => this.onChangeItem(index, 'contact', subValue)}
              commentChangeFn={subValue => this.onChangeItem(index, 'comment', subValue)}
              readOnly={this.props.readOnly}
              onBlur={this.onBlur}
              field={this.props.field}
              onUpdate={this.onUpdate}
              contactUpdateProcess={changedIndex === index && changedProperty === 'contact' && updateProcess}
              commentUpdateProcess={changedIndex === index && changedProperty === 'comment' && updateProcess}
              error={this.props.error || null}
            />
            {
              !this.props.readOnly && !!size &&
              <span
                title={trs('record.fields.contact.removeBtnTitle')}
                className="m-close record-contact__remove-btn"
                onClick={() => this.onRemoveItem(index)}
              />
            }
          </div>
        </li>
      );
    });

    let removed = this.state.removed.map((item, index) => {
      return (
        <li className="record-contact" key={index}>
          <div className="m-text_muted record-contact-restore">
            <span
              className="record-contact-restore__contact"
              title={item.get('comment') || item.get('contact')}>
              {item.get('contact') || item.get('comment')}
            </span>&nbsp;
            <a href="javascript:void(0)" className="m-text_muted" onClick={() => this.onRestoreItem(index)}>
              {trs('record.fields.contact.restore')}
            </a>
          </div>
        </li>
      );
    });

    return (
      <div>
        <Hint
          className="record-field__body__hint--in-top record__hint--before-contacts"
          text={this.props.hint}
          readOnly={this.props.readOnly}
        />

        <ul className="record__contacts">
          {exists}
          {removed}
        </ul>

        {
          !this.props.readOnly && !newItem &&
          <AddBtn readOnly={this.props.readOnly} onClick={e => this.onItemAdd()} />
        }
      </div>
    );
  }
});

export default ContactField;
