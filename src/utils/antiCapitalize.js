import _ from 'lodash'

export default function antiCapitalize(str){
  if ( !_.isString(str) ) {
    return str;
  }

  // берем вторую букву
  let secondLetter = str.replace(/\s/g, '').charAt(1);

  // если вторая буква в верхнем регистре, то не нужно уменьшать первую, например, это аббривиатра: СССР
  if ( secondLetter && secondLetter.toUpperCase() === secondLetter ) {
    return str;
  }

  return str && (str.charAt(0).toLowerCase() + str.slice(1));
}
