import _ from 'lodash';
import moment from 'moment';

const formats = {
  years: 'yy',
  months: 'MM',
  days: 'dd',
  hours: 'hh',
  minutes: 'mm',
  seconds: 's'
};

function formatDate(momentDuration, partKey, withSuffix = false) {
  const valuePart = momentDuration[partKey]();

  if (!valuePart) {
    return '';
  }

  let text;
  const letterKey = formats[partKey];
  const formatFn = momentDuration.localeData()._relativeTime[letterKey];

  if (_.isFunction(formatFn)) {
    text = formatFn(valuePart, !withSuffix, letterKey);
  } else {
    text = formatFn;
  }

  const findShortText = String(text).match(/[^\d\s]/);
  const shortText = findShortText && findShortText[0];
  return valuePart + shortText;
}

function formatTime(momentDuration, format) {
  return moment(new Date(
    momentDuration.hours() * 3600 * 1000
    + momentDuration.minutes() * 60 * 1000
    + momentDuration.seconds() * 1000
  )).utc().format(format);
}

export default function duration(value) {
  const d = moment.duration(value, 'seconds');

  if (d.years()) {
    return formatDate(d, 'years') + ' ' + formatDate(d, 'months', true);
  } else if (d.months()) {
    return formatDate(d, 'months') + ' ' + formatDate(d, 'days', true);
  } else if (d.days()) {
    return formatDate(d, 'days') + ' ' + formatDate(d, 'hours', true);
  }

  return formatTime(d, 'H:mm:ss');
}
