import debug from 'debug';
import _ from 'lodash';
import Immutable from 'immutable';
import router from '../router';
import apiActions from '../actions/apiActions';

const log = debug('CRM:sectionsMixin');

export default {

  clearSectionUpdateError(sectionId) {
    this.setIn(['sections', sectionId, 'updateError'], null);
    this.changed();
  },

  clearSectionDeleteError(sectionId) {
    this.setIn(['sections', sectionId, 'deleteError'], null);
    this.changed();
  },

  /* ===============================
   * Get Sections
   */
  getSection({sectionId}) {
    log('getSection', sectionId);
    this.setIn(['sectionsLoading', sectionId], true);
    this.changed();
  },

  getSectionCompleted(section, {sectionId}) {
    log('getSection complete', section);
    this.setIn(['sectionsLoading', sectionId], false);
    this.setIn(['sectionsLoaded', sectionId], true);
    this.setIn(['sections', sectionId], Immutable.fromJS(section));
    this.changed();
  },

  getSectionFailed(params) {
    log('getSection failed', params);
    this.setIn(['sectionsLoading', params.sectionId], false);
    this.setIn(['sectionsLoadError', params.sectionId], true);
    this.changed();
  },

  getSections(params) {
    log('getSections', params);
    if (!this.get('initialDataLoaded') && !this.get('initialDataLoading')) {
      this.set('initialDataLoading', true);
      this.changed();
    }
  },

  getSectionsCompleted(res) {
    let sections = this.get('sections');
    let byId = {};
    res.forEach((s, i)=> {
      s.id = s.id.toString();
      s.index = i;
      byId[s.id] = s;
    });
    this.set('sections', sections.mergeDeep(byId));

    this.set('initialDataLoading', false);
    this.set('initialDataLoaded', true);
    this.changed();
  },

  getSectionsFailed() {
    if (!this.get('initialDataLoaded') && this.get('initialDataLoading')) {
      this.set('initialDataLoading', false);
      this.changed();
    }
  },

  /* ========================
   * Create Section
   */
  createSection(params) {
    this.set('sectionCreating', true);
    this.set('sectionCreateError', null);
    this.changed();
  },

  createSectionCompleted(res, params, data) {
    this.setIn(['sections', res.id], Immutable.fromJS({
      id: res.id,
      name: data.name,
      icon: ''
    }));
    this.set('sectionCreating', false);
    this.set('sectionCreateError', null);

    this.changed();

    apiActions.getSections();

    // go to create new catalog.
    router.go('main.section', {
      sectionId: res.id
    });
  },

  createSectionFailed(err, params) {
    const errText = (_.isObject(err) && err.text) ? err.text : '';
    this.set('sectionCreating', false);
    this.set('sectionCreateError', errText || true);
    this.changed();
  },

  /* ========================
   * Update Section
   */
  updateSection(params) {
    this.setIn(['sections', params.sectionId, 'updating'], params.sectionId);
    this.setIn(['sections', params.sectionId, 'updateError'], null);
    this.changed();
  },

  updateSectionCompleted(res, params, data) {
    let section = this.getIn(['sections', params.sectionId]);
    section = section.merge(data);
    this.setIn(['secitons', params.sectionId], section);

    this.setIn(['sections', params.sectionId, 'updating'], false);
    this.setIn(['sections', params.sectionId, 'updateError'], null);

    this.changed();

    apiActions.getSections();
  },

  updateSectionFailed(err, params) {
    const errText = (_.isObject(err) && err.text) ? err.text : '';
    this.setIn(['sections', params.sectionId, 'updating'], false);
    this.setIn(['sections', params.sectionId, 'updateError'], errText || true);
    this.changed();
  },

  /* ========================
   * Delete Section
   */
  deleteSection(params) {
    this.setIn(['sections', params.sectionId, 'deleting'], params.sectionId);
    this.setIn(['sections', params.sectionId, 'deleteError'], null);
    this.changed();
  },

  deleteSectionCompleted(res, params) {
    let sections = this.get('sections').delete(params.sectionId);
    this.set('sections', sections);

    if (router.includes('main.section', {sectionId: params.sectionId})) {
      router.go('main');
    }

    this.changed();

    apiActions.getSections();
  },

  deleteSectionFailed(err, params) {
    const errText = (_.isObject(err) && err.text) ? err.text : '';
    this.setIn(['sections', params.sectionId, 'deleting'], false);
    this.setIn(['sections', params.sectionId, 'deleteError'], errText || true);
    this.changed();
  }
};
