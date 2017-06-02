import React from 'react'

export default function nlToBr(str) {
  let newlineRegex = /(\r\n|\n\r|\r|\n)/g;
  return str.split(newlineRegex).map(function (line, index) {
    if (line.match(newlineRegex)) {
      return React.createElement('br', { key: index });
    } else {
      return line;
    }
  });
}
