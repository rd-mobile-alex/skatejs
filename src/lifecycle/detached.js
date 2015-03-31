import data from '../utils/data';
import elementContains from '../utils/element-contains';

export default function (options) {
  return function () {
    var element = this;
    var targetData = data(element, options.id);

    if (targetData.detached) {
      return;
    }

    if (elementContains(document, element)) {
      return;
    }

    targetData.detached = true;

    if (options.detached) {
      options.detached(element);
    }

    targetData.attached = false;
  };
}
