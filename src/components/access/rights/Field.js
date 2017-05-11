import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Reflux from 'reflux';
import classNames from 'classnames';
import trs from '../../../getTranslations';
import FieldControl from './FieldControl';

const log = require('debug')('CRM:Component:Record:Field');

const Field = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    catalogId: React.PropTypes.string,
    value: React.PropTypes.string,
    onSaveField: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {value: ''};
  },

  onSave(value) {
    this.props.onSaveField(this.props.id, value);
  },

  componentDidMount() {

    this.setState({value: this.props.value});
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.value) {
      this.setState({
        value: nextProps.value
      });
    }
  },

  render() {

    return (
      <tr className={' record-field record-field--' + this.props.type}>
        <td className={'record-field__header'} title={this.props.name}>
          {this.props.name}
        </td>
        <td className={'record-field__body'}>
          <FieldControl value={this.state.value} onSave={this.onSave} />
        </td>
      </tr>
    );
  }

});

export default Field;
