import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import _ from 'lodash'

import dndContext from '../../../services/dndContext';
import trs from '../../../getTranslations';

const log = require('debug')('CRM:Component:catalogData:Import:ImportModal');

const stepComponents = [
  require('./StepFile'),
  require('./StepFields'),
  require('./StepKey')
];

const stepsCount = 3;

const ImportModal = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    appState: React.PropTypes.object.isRequired,
    catalogId: React.PropTypes.string.isRequired,
    onImportDone: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      step: 0,
      fileId: null,
      fieldMatches: null
    };
  },

  goToStep(step, fileId, fieldMatches) {
    log('goToStep', step, fileId, fieldMatches);
    if ( step > this.state.step ) {
      this.setState({
        step: step,
        fileId,
        fieldMatches
      });
    }
  },

  onImportDone(fileId, fieldMatches, keyId) {
    // apiActions.
  },

  render() {

    var steps = [];

    for (var i = 0; i < stepsCount; i++) {
      if ( i < this.state.step) {
        steps.push(
          <a
              href="javascript:void(0)"
              onClick={_.bind(this.goToStep, this, i)}
              key={i}
              className="modal-import__header-step modal-import__header-step--done">
            {trs(`import.steps.${i}`)}
          </a>
        );
      } else {
        steps.push(
          <span
              key={i}
              className={'modal-import__header-step' + (i === this.state.step ? ' modal-import__header-step--active' : '')}>
            {trs(`import.steps.${i}`)}
          </span>
        );
      }
      if ( i < stepsCount - 1 ) {
        steps.push(<span key={i+'arr'} className="modal-import__header-step-arrow icon icon--arrows-linear-medium-2-01" />);
      }
    }

    var Step = stepComponents[this.state.step];

    return (
      <div className="modal-import__wrapper">
        <header className="modal-window__header">
          <i className="modal-window__header__close" onClick={this.props.closeModal} />
          <h2 className="modal-window__header__title">{trs('import.header')}</h2>
          <div className="modal-window__header-steps">{steps}</div>
        </header>
        <Step changeStep={this.goToStep} fileId={this.state.fileId} fieldMatches={this.state.fieldMatches} {...this.props} />
      </div>
    );
  }

});

export default dndContext(ImportModal);
