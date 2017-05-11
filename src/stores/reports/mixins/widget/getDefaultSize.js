import {NUMBER} from '../../../../configs/reports/widget/chartTypes';

export default function (widget, maxWidth) {
  switch (widget.getIn(['chartType'])) {
    case undefined:
    case null:
    case '':
    default:
      return {w: Math.ceil(maxWidth / 3), h: 4};
  }
}
