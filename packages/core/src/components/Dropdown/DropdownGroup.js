import _styles from '@patternfly/react-styles/css/components/Dropdown/dropdown';

// commonjs bug
let styles = _styles.default;

import {h, mergeProps} from 'vue';

export default (props, {slots}) =>
  h('section', mergeProps({class: styles.dropdownGroup}, props), [
    slots.label && h('h1', {
      class: styles.dropdownGroupTitle,
      'aria-hidden': '',
    }, slots.label()),
    h('ul', {role: 'none'}, slots.default()),
  ]);