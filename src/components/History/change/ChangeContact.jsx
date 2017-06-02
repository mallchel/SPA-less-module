import _ from 'lodash';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import createFragment from 'react-addons-create-fragment';

const ChangeContact = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    change: React.PropTypes.object.isRequired,
    isNewRecord: React.PropTypes.bool
  },

  render() {

    let mixedList = {};

    this.props.change.get('oldValue')
      .map((value, i) => {
        if (!mixedList[value.get('id')]) {
          mixedList[value.get('id')] = {'old': null, 'new': null}
        }
        mixedList[value.get('id')]['old'] = (
          <li className="removed" key={i}>
            <span className="contact-text">{value.get('contact')}</span>
            <span className="contact-comment"><small>{value.get('comment')}</small></span>
          </li>
        );
      });
    this.props.change.get('newValue')
      .map((value, i) => {
        if (!mixedList[value.get('id')]) {
          mixedList[value.get('id')] = {'old': null, 'new': null}
        }
        mixedList[value.get('id')]['new'] = (
          <li key={i}>
            <span className="contact-text">{value.get('contact')}</span>
            <span className="contact-comment"><small>{value.get('comment')}</small></span>
          </li>
        );
      });

    return (
      <ul className="contact-list">
        {_.map(mixedList, el=> {
          return createFragment(el);
        })}
      </ul>
    );
  }

});

export default ChangeContact;
