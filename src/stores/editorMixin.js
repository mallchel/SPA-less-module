import debug from 'debug';
import Guid from 'guid';
import Immutable from 'immutable';

import FieldFactory from '../models/FieldFactory';
import generateUniqName from '../utils/generateUniqName';

const log = debug('CRM:Store:editorMixin');

const editorMixin = {

  _setEditingCatalogUnsaved(sectionId, val) {
    this.setIn(['editingCatalogs', sectionId, 'unsaved'], !!val);
  },

  removeField(sectionId, fieldIndex) {
    let fields = this.getIn(['editingCatalogs', sectionId, 'fields']);
    this.setIn(['editingCatalogs', sectionId, 'fields'], fields.delete(fieldIndex));
    this._setEditingCatalogUnsaved(sectionId, true);
    this.changed();
  },

  dropField(sectionId, fieldIndex, fieldType, prevFieldIndex) {
    let field;

    if ( fieldIndex != null ) {
      let fields = this.getIn(['editingCatalogs', sectionId, 'fields']);
      field = fields.get(fieldIndex);
      this.setIn(['editingCatalogs', sectionId, 'fields'], fields.delete(fieldIndex));
    }

    if ( !field ) {
      field = FieldFactory.create({
        // id: Guid.raw(),
        type: fieldType
      });
      let uniqName = generateUniqName(field.get('name'), this.getIn(['editingCatalogs', sectionId, 'fields']).toArray().map((c)=> c.get('name')));
      field = field.set('name', uniqName);
    }

    let fields = this.getIn(['editingCatalogs', sectionId, 'fields']);
    let offset = 0;
    if (fieldIndex === undefined || prevFieldIndex < fieldIndex) {
      offset = 1;
    }
    this.setIn(['editingCatalogs', sectionId, 'fields'], fields.splice(prevFieldIndex + offset, 0, field));
    this._setEditingCatalogUnsaved(sectionId, true);
    this.changed();
  },


  changeFieldConfig(sectionId, fieldIndex, config) {
    let state = this.getState();
    state = state.mergeIn(['editingCatalogs', sectionId, 'fields', fieldIndex, 'config'], config || {});
    this.setState(state);
    this._setEditingCatalogUnsaved(sectionId, true);
    this.changed();
  },

  setFieldName(sectionId, fieldIndex, name) {
    this.setIn(['editingCatalogs', sectionId, 'fields', fieldIndex, 'name'], name);
    this._setEditingCatalogUnsaved(sectionId, true);
    this.changed();
  },

  setFieldRequired(sectionId, fieldIndex, required) {
    this.setIn(['editingCatalogs', sectionId, 'fields', fieldIndex, 'required'], required);
    this._setEditingCatalogUnsaved(sectionId, true);
    this.changed();
  },

  setFieldApiOnly(sectionId, fieldIndex, enabled) {
    this.setIn(['editingCatalogs', sectionId, 'fields', fieldIndex, 'apiOnly'], enabled);
    this._setEditingCatalogUnsaved(sectionId, true);
    this.changed();
  },

  setFieldHint(sectionId, fieldIndex, name) {
    this.setIn(['editingCatalogs', sectionId, 'fields', fieldIndex, 'hint'], name);
    this._setEditingCatalogUnsaved(sectionId, true);
    this.changed();
  },


  setCatalogIcon(sectionId, icon) {
    this.setIn(['editingCatalogs', sectionId, 'icon'], icon);
    this._setEditingCatalogUnsaved(sectionId, true);
    this.changed();
  },

  setCatalogName(sectionId, name) {
    this.setIn(['editingCatalogs', sectionId, 'name'], name);
    this._setEditingCatalogUnsaved(sectionId, true);
    this.changed();
  }

  // saveEditingCatalog() {
  //   let catalogId = this.getIn(['editingCatalog', 'id']);
  //   if ( this.getIn(['editingCatalog', 'isNew']) ) {
  //     let st = this.getState();
  //     st = st
  //       .setIn(['editingCatalog', 'isNew'], false)
  //       .setIn(['editingCatalog', 'unsaved'], false)
  //       .set('catalogs', st.get('catalogs').set('new', st.get('editingCatalog')) )
  //       .set('editingCatalog', null);
  //     this.setState(st);
  //   } else {
  //     let cat = this.getIn(['catalogs', catalogId]);
  //     if ( cat ) {
  //       let st = this.getState();
  //       st = st
  //         .setIn(['editingCatalog', 'unsaved'], false)
  //         .setIn(['catalogs', catalogId], st.get('editingCatalog'))
  //         .set('editingCatalog', null);
  //       this.setState(st);
  //     } else {
  //       // TODO
  //     }
  //   }

  //   this.changed();
  // }
};

export default editorMixin;
