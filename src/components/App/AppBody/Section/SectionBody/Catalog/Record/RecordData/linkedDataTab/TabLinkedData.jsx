import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Reflux from 'reflux'
import apiActions from '../../../../../../../../../actions/apiActions'
import modalsActions from '../../../../../../../../../actions/modalsActions'
import Loading from '../../../../../../../../common/Loading'
import ModalStore from '../../../../../../../../../stores/ModalStore'
import LinkedCatalog from './LinkedCatalog'

const TabLinkedData = React.createClass({
  mixins: [PureRenderMixin, Reflux.listenTo(ModalStore, 'updateCatalog')],
  propTypes: {
    record: React.PropTypes.object.isRequired,
    catalogId: React.PropTypes.string.isRequired
  },

  loadLinkedData(props = this.props) {
    apiActions.getRelations({
      catalogId: props.catalogId,
      recordId: props.record.get('id')
    });
  },

  onClickCreate(catalogId) {
    modalsActions.openRelatedRecordCreate(catalogId, {
      catalogId: this.props.catalogId,
      record: this.props.record
    }, {
        allowClose: true, linkBack: true,
        onCreate: () => {
          apiActions.getRelations({ catalogId: this.props.catalogId, recordId: this.props.record.get('id') });
        }
      });
  },

  componentDidMount() {
    this.loadLinkedData();
  },

  updateCatalog(event) {
    if (event.event && event.event == 'closeRecordModal') {
      if (event.parentCatalogId == this.props.catalogId && event.parentRecordId == this.props.record.get('id')) {
        this.loadLinkedData();
      }
    }
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.record.get('id') !== this.props.record.get('id')) {
      this.loadLinkedData(nextProps);
    }
  },

  render() {
    let linkedData = this.props.record.get('linkedData');
    let classNames = 'list-data';

    return (
      <div className={classNames}>
        {linkedData && linkedData.size ?
          linkedData.map((catalog, idx) =>
            <LinkedCatalog
              onClickCreate={this.onClickCreate}
              key={catalog.get('id')}
              catalog={catalog}
              record={this.props.record}
              loadCatalog={this.loadLinkedData}
              index={idx}
            />) :
          !linkedData && <Loading fullHeight={true} />
        }
      </div>
    );
  }

});

export default TabLinkedData;
