import _ from 'lodash';
import moment from 'moment';

const log = require('debug')('CRM:Utils:formatDate');

const CURRENT_YEAR = (new Date()).getFullYear();

const removeYearFromFormat = _.memoize(function (format) {
  return format
    .replace(/([\,\.\/ ]*Y+[\,\.\/ ]*)/, ' ') // remove year
    .replace(/ +/g, ' ') // remove double spaces
    .replace(/(^ | $)/g, ''); // trim
});

function getFormatWithoutYear(format) {
  const locale = moment.locale();
  // and others but need test
  if (/ru|en|cs/.test(locale)) {
    return removeYearFromFormat(moment().localeData().longDateFormat(format))
  }

  return format;
}

export function formatDate(date, withTime = false) {
  if (!date) {
    log('empty date');
    return '';
  }
  if (!moment.isMoment(date)) {
    date = moment(new Date(date));
  }

  let format = withTime ? 'lll' : 'll';

  if (date.year() === CURRENT_YEAR) {
    format = getFormatWithoutYear(format);
  }

  return date.format(format);
}

export function formatTime(date) {
  if (!date) {
    log('empty date');
    return '';
  }
  if (!moment.isMoment(date)) {
    date = moment(new Date(date));
  }
  return date.format('LT');
}
