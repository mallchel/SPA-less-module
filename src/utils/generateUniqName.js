import _ from 'lodash'

const sortFn = function(a,b) {
  if ( a > b ) { return 1; }
  if ( b > a ) { return -1; }
  return 0;
};

module.exports = function(name, names) {
  var rx = new RegExp(name + ' \\(([0-9]+)\\)$');
  var indexes = [];

  names.forEach((n)=> {
    if ( n.indexOf(name) === 0 ) {
      if ( n === name ) {
        indexes.push(0);
      } else {
        let m = n.match(rx);
        if ( m ) {
          indexes.push(parseInt(m[1]));
        }
      }
    }
  });

  indexes = _.uniq(indexes.sort(sortFn));
  var k = 0;

  while (indexes.length && k === indexes.shift()) {
    k++;
  }

  return name + (k === 0 ? '' : ` (${k})`);
};
