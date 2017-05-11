import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import _ from 'lodash'

import RESOURCE_TYPES from '../../configs/resourceTypes';

import {
  ACTION_PARAM_NAME,
  ACTION_RECORD_OPEN,
  ACTION_RECORD_NEW,
  ACTION_RECORD_PARAM_CATALOG_NAME,
  ACTION_RECORD_PARAM_RECORD_NAME
} from '../../configs/routes';

import trs from '../../getTranslations';
import HelpIcon from '../common/HelpIcon';

const trsPrefix = 'modals.access.';

const modalTrs = key=> trs(trsPrefix + key);

const PublicAccess = React.createClass({
  propTypes: {
    resource: React.PropTypes.string.isRequired,
    object: React.PropTypes.object.isRequired
  },

  render() {
    let title;
    let params;

    if ( this.props.resource === RESOURCE_TYPES.CATALOG ) {
      title = modalTrs('publicAccess.catalogHeader');
      params = {
        [ACTION_PARAM_NAME]: ACTION_RECORD_NEW,
        [ACTION_RECORD_PARAM_CATALOG_NAME]: this.props.object.catalogId
      };
    } else if ( this.props.resource === RESOURCE_TYPES.RECORD ) {
      title = modalTrs('publicAccess.recordHeader');
      params = {
        [ACTION_PARAM_NAME]: ACTION_RECORD_OPEN,
        [ACTION_RECORD_PARAM_CATALOG_NAME]: this.props.object.catalogId,
        [ACTION_RECORD_PARAM_RECORD_NAME]: this.props.object.recordId
      };
    } else {
      return null;
    }

    let urlParams = _.reduce(params, (arr, val, key)=> {
      return arr.concat(key + '=' + val);
    }, []).join('&');

    return (
      <div className='access-modal__public-access'>
        <strong>{title}</strong>&nbsp;
        <HelpIcon helpPath='web-forms.html' icon='icon icon--interface-56 m-text_light access-public-access__help-link' />
        <br/>
        {window.location.protocol + '//' + window.location.host + '/?' + urlParams}
      </div>
    );
  }
});

export default PublicAccess
