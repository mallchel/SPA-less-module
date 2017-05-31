import tinyColor from 'tinycolor2'

export default function getBorderColor(color) {
  return tinyColor(color).darken(18).desaturate(35).toHexString();
}
