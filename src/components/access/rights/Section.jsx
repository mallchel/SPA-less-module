import React from 'react';
// import PureRenderMixin from 'react-addons-pure-render-mixin';
// import Reflux from 'reflux';
import classNames from 'classnames';
import trs from '../../../getTranslations';
import Field from './Field';

// import PRIVILEGE_CODES from '../../../configs/privilegeCodes';

const Section = React.createClass({
  // mixins: [PureRenderMixin],
  propTypes: {
    catalogId: React.PropTypes.string,
    basePrivilege: React.PropTypes.string,
    section: React.PropTypes.object.isRequired,
    fields: React.PropTypes.array.isRequired,
    onSaveField: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      open: true, // TODO: default value
      errors: [],
      values: {}
    };
  },

  toggleList() {
    this.setState({
      open: !this.state.open
    });
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.values) {
      this.setState({
        values: nextProps.values
      });
    }
  },

  render() {
    let fieldItems = this.props.fields.map((field)=> {
      let fieldId = field.get('id');
      return (
        <Field
          key={fieldId}
          id={fieldId}
          onSaveField={this.props.onSaveField}
          name={field.get('name')}
          type={field.get('type')}
          value={this.state.values[fieldId] || this.props.basePrivilege}
        />
      );
    });

    return (
      <div className={classNames({'record-section': true, 'record-section--open': this.state.open })}>
        <div className="record-section__header" onClick={this.toggleList}>
          <span className="record-section__header-text">{this.props.section.get('name')}</span>
          { !this.state.open ? <span className="record-section__header-count">{trs('record.groupFieldsCount', this.props.fields.length)}</span> : null }
        </div>
        <div className="record-section__fields">
          <table className="record-section__table">
            <tbody>
              {fieldItems}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

});

export default Section;
