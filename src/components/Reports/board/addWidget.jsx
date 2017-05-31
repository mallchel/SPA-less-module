import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import trs from '../../../getTranslations';

const AddWidget = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {},

  render() {
    return (
      <div className='widget widget--add add-widget' onClick={this.props.onClick}>
        <div className='add-widget__add-btn-wrapper'>
          <div className='add-widget-btn add-widget__add-btn'>
            <span className='icon icon--interface-69 add-widget-btn__icon'/>
            <span className='add-widget-btn__text'>{trs('reports.buttons.addWidget')}</span>
          </div>
        </div>
      </div>
    );
  }
});

export default AddWidget;
