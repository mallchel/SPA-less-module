import _ from 'lodash'

// const log = require('debug')('CRM:Translations');

var cache = {};

const translations = {
  ru: require('../translations/ru.json'),
  en: require('../translations/ru.json')
};

module.exports = function(path, count) {
  var result = translations[(window.app && window.app.currentLang) || 'ru'];

  if ( !path ) {
    return result;
  }

  var pathWithCount = path + (count !== null ? count : '');

  if ( cache[pathWithCount] ) {
    return cache[pathWithCount];
  }

  var pathArr  = path.split('.');

  while ( pathArr.length && result ) {
    result = result[pathArr.shift()];
  }

  if ( count != null ) {
    let _count = count % 100;
    if ( _count >= 20 ) {
      _count = _count % 10;
    }
    let text;
    _.forEach(result, (t, c)=> {
      if ( parseInt(c, 10) <= _count ) {
        text = t;
      }
    });
    result = count + ' ' + text;
  }

  if ( !result ) {
    // log(`No translation for '${path}'`);
  } else {
    cache[pathWithCount] = result;
  }

  return result || 'NO TRANSLATION (' + path + ')';
};
