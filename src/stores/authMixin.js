import debug from 'debug';
import Immutable from 'immutable';

const log = debug('CRM:authMixin');


export default {
  getCompanyInfoCompleted(response) {
    const {extensions, modules, title, domain} = response.body;

    extensions.forEach(m=> {
      m.css && window.LazyLoad.css(m.css);
      m.js && window.LazyLoad.js(m.js);
    });

    this.set('companyTtile', title);
    this.set('companyDomain', domain);

    this.set('extensions', Immutable.fromJS(extensions.map(m=> {
      return {
        code: m.code,
        title: m.title,
        icon: m.icon
      };
    })));

    this.set('modules', Immutable.fromJS(modules.map(m=> {
      return m.code;
    })));

    this.changed();
  }
};
