import {computed} from 'vue';

export const breakpoints = ['', 'Sm', 'Md', 'Lg', 'Xl', '2xl'];

const camelize = s =>
  s
    .toUpperCase()
    .replace('-', '')
    .replace('_', '');

/**
 *
 * @param {string} s string to make camelCased
 */
export const toCamel = s => s.replace(/([-_][a-z])/gi, camelize);

export const ucfirst = s => s.charAt(0).toUpperCase() + s.slice(1);

export function classesFromBreakpointProps(props, baseNames, styles, {additional = [], short = false} = {}) {
  const c = [...additional];

  for (const baseName of baseNames) {
    for (let breakpointSuffix of breakpoints) {
      if (breakpointSuffix === '2xl') {
        breakpointSuffix = '_2xl';
      }
      const prop = `${baseName}${breakpointSuffix}`;
      let value = props[prop];
      if (value) {
        if (value === true) {
          value = '';
        } else {
          value = toCamel(value);
          if (value.match(/^[0-9]/)) {
            value = `_${value}`;
          }
        }
        let mod = `${value}${breakpointSuffix ? `On${breakpointSuffix}` : ''}`;
        if (!short) {
          mod = `${toCamel(baseName)}${ucfirst(mod)}`;
        }
        c.push(styles.modifiers[mod]);
      }
    }
  }

  return c.filter(Boolean);
}

export function useBreakpointProp(...args) {
  return computed(() => classesFromBreakpointProps(...args));
}

export function breakpointProp(baseName, type, values) {
  return Object.fromEntries(breakpoints.map(b => {
    let _default = null;
    if (Array.isArray(values) && values.length) {
      _default = values[0]
    } else if (type === Boolean) {
      _default = false;
    }
    const definition = {
      type,
      default: _default,
    };
    if (Array.isArray(values)) {
      definition.validate = v => values.includes(v);
    }
    return [`${baseName}${b}`, definition];
  }));
}

export function debounce(func, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(args), wait);
  };
}

/** This function returns whether or not an element is within the viewable area of a container. If partial is true,
 * then this function will return true even if only part of the element is in view.
 *
 * @param {HTMLElement} container  The container to check if the element is in view of.
 * @param {HTMLElement} element    The element to check if it is view
 * @param {boolean} partial   true if partial view is allowed
 *
 * @returns { boolean } True if the component is in View.
 */
export function isElementInView(container, element, partial) {
  console.log(element, container)
  if (!container || !element) {
    return false;
  }
  const containerBounds = container.getBoundingClientRect();
  const elementBounds = element.getBoundingClientRect();
  const containerBoundsLeft = Math.floor(containerBounds.left);
  const containerBoundsRight = Math.floor(containerBounds.right);
  const elementBoundsLeft = Math.floor(elementBounds.left);
  const elementBoundsRight = Math.floor(elementBounds.right);

  // Check if in view
  const isTotallyInView = elementBoundsLeft >= containerBoundsLeft && elementBoundsRight <= containerBoundsRight;
  const isPartiallyInView =
    partial &&
    ((elementBoundsLeft < containerBoundsLeft && elementBoundsRight > containerBoundsLeft) ||
      (elementBoundsRight > containerBoundsRight && elementBoundsLeft < containerBoundsRight));

  // Return outcome
  return isTotallyInView || isPartiallyInView;
}

/**
 * @param {string} prefix - String to prefix ID with
 */
export function getUniqueId(prefix = 'pf') {
  const uid =
    new Date().getTime() +
    Math.random()
      .toString(36)
      .slice(2);
  return `${prefix}-${uid}`;
}
