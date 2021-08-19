<template>
  <teleport :to="teleportTarget">
    <pf-backdrop v-if="open">
      <pf-focus-trap
        :class="bullsEyeStyles.bullseye"
        :active="!disableFocusTrap"
      >
        <div
          v-bind="$attrs"
          role="dialog"
          :aria-label="ariaLabel"
          :aria-labelledby="ariaLabelledby"
          :aria-describedby="ariaDescribedby || (noBodyWrapper ? null : descriptorId)"
          aria-modal="true"
          :class="[styles.modalBox, {
            [styles.modifiers.alignTop]: position === 'top',
            [styles.modifiers.lg]: variant === 'large',
            [styles.modifiers.sm]: variant === 'small',
            [styles.modifiers.md]: variant === 'medium',
            [styles.modifiers[titleIconVariant]]: titleIconVariant,
          }]"
          :style="{[topSpacer.name]: positionOffset}"
        >
          <pf-close-button
            v-if="!noClose"
            @click="$emit('update:open', false)"
          />

          <pf-modal-header>
            <slot name="header">
              <component
                :is="titleOverflowing ? 'pf-tooltip' : 'void'"
                v-if="title"
              >
                <h1
                  ref="titleRef"
                  :class="[styles.modalBoxTitle, {
                    [styles.modifiers.icon]: titleIconVariant,
                  }]"
                >
                  <span
                    v-if="titleIconVariant"
                    :class="styles.modalBoxTitleIcon"
                  >
                    <CheckCircleIcon v-if="titleIconVariant === 'success'" />
                    <ExclamationCircleIcon v-else-if="titleIconVariant === 'danger'" />
                    <ExclamationTriangleIcon v-else-if="titleIconVariant === 'warning'" />
                    <InfoCircleIcon v-else-if="titleIconVariant === 'info'" />
                    <BellIcon v-else-if="titleIconVariant === 'default'" />
                    <slot
                      v-else
                      name="title-icon"
                    />
                  </span>
                  <span
                    v-if="label"
                    :class="accessibleStyles.screenReader"
                  >{{ label }}</span>
                  <span :class="styles.modalBoxTitleText">{{ title }}</span>
                </h1>

                <template #content>
                  {{ title }}
                </template>
              </component>

              <div
                v-if="$slots.description"
                :id="descriptorId"
                :class="styles.modalBoxDescription"
              >
                <slot name="description" />
              </div>
            </slot>

            <template #help>
              <slot name="help" />
            </template>
          </pf-modal-header>

          <component
            :is="noBodyWrapper ? 'void' : 'div'"
            :id="$slots.description || ariaDescribedby ? null : descriptorId"
            :class="styles.modalBoxBody"
          >
            <slot />
          </component>

          <footer
            v-if="$slots.footer"
            :class="styles.modalBoxFooter"
          >
            <slot name="footer" />
          </footer>
        </div>
      </pf-focus-trap>
    </pf-backdrop>
  </teleport>
</template>

<script>
import styles from '@patternfly/react-styles/css/components/ModalBox/modal-box';
import backdropStyles from '@patternfly/react-styles/css/components/Backdrop/backdrop';
import accessibleStyles from '@patternfly/react-styles/css/utilities/Accessibility/accessibility';
import bullsEyeStyles from '@patternfly/react-styles/css/layouts/Bullseye/bullseye';
import topSpacer from '@patternfly/react-tokens/dist/esm/c_modal_box_m_align_top_spacer';

import PfModalHeader from './ModalHeader.vue';
import Void from '../Void';
import PfBackdrop from '../Backdrop';
import PfFocusTrap from '../FocusTrap.vue';
import PfTooltip from '../Tooltip/Tooltip.vue';
import PfCloseButton from '../CloseButton';
import CheckCircleIcon from '@vue-patternfly/icons/dist/esm/icons/check-circle-icon';
import ExclamationCircleIcon from '@vue-patternfly/icons/dist/esm/icons/exclamation-circle-icon';
import ExclamationTriangleIcon from '@vue-patternfly/icons/dist/esm/icons/exclamation-triangle-icon';
import InfoCircleIcon from '@vue-patternfly/icons/dist/esm/icons/info-circle-icon';
import BellIcon from '@vue-patternfly/icons/dist/esm/icons/bell-icon';
import { capitalize } from '@vue/shared';
import { ref } from 'vue';
import { useElementOverflow } from '../../use';

export default {
  name: 'PfModal',

  components: {
    PfModalHeader,
    PfCloseButton,
    Void,
    PfBackdrop,
    PfFocusTrap,
    PfTooltip,
    CheckCircleIcon,
    ExclamationCircleIcon,
    ExclamationTriangleIcon,
    InfoCircleIcon,
    BellIcon,
  },

  // inject: ['open'],

  props: {
    /** Flag to show the modal */
    open: Boolean,

    /** Flag to remove the close button in the header area of the modal */
    noClose: Boolean,

    /** Flag indicating if modal content should be placed in a modal box body wrapper */
    noBodyWrapper: Boolean,

    /** Flag to disable focus trap */
    disableFocusTrap: Boolean,

    /** Simple text content of the Modal Header, also used for aria-label on the body */
    title: {
      type: String,
      default: '',
    },

    /** Optional title label text for screen readers */
    titleLabel: {
      type: String,
      default: '',
    },

    /** Optional alert icon (or other) to show before the title of the Modal Header
     * When the predefined alert types are used the default styling
     * will be automatically applied */
    titleIconVariant: {
      type: String,
      default: null,
      validator: v => [null, '', 'default', 'success', 'danger', 'warning', 'info'].includes(v),
    },

    appendTo: {
      type: [Function, HTMLElement, String],
      default: null,
    },

    /** Accessible descriptor of modal */
    ariaLabel: {
      type: String,
      default: '',
    },

    /** Id of Modal Box description */
    ariaDescribedby: {
      type: String,
      default: '',
    },

    /** Id of Modal Box label */
    ariaLabelledby: {
      type: String,
      default: '',
    },

    /** Variant of the modal */
    variant: {
      type: String,
      default: 'default',
      validator: v => [null, '', 'default', 'small', 'medium', 'large'].includes(v),
    },

    /** Alternate position of the modal */
    position: {
      type: String,
      default: 'default',
      validator: v => [null, '', 'default', 'top'].includes(v),
    },

    /** Offset from alternate position. Can be any valid CSS length/percentage */
    positionOffset: {
      type: String,
      default: '',
    },

    /** Id of the ModalBoxBody */
    descriptorId: {
      type: String,
      default: '',
    },
  },

  emits: ['update:open'],

  setup() {
    const titleRef = ref(null);

    return {
      titleRef,
      titleOverflowing: useElementOverflow(titleRef),
    };
  },

  data() {
    return {
      styles,
      accessibleStyles,
      bullsEyeStyles,
      topSpacer,
    };
  },

  computed: {
    teleportTarget() {
      if (typeof this.appendTo === 'function') {
        return this.appendTo();
      }
      if (typeof this.appendTo === 'string') {
        return document.getElementById(this.appendTo);
      }
      return this.appendTo || document.body;
    },

    label() {
      if (!this.titleLabel && this.titleIconVariant) {
        return `${capitalize(this.titleIconVariant)} alert:`;
      }
      return this.titleLabel;
    },
  },

  watch: {
    open() {
      if (this.open) {
        this.teleportTarget.classList.add(backdropStyles.backdropOpen);
      } else {
        this.teleportTarget.classList.remove(backdropStyles.backdropOpen);
      }
    },
  },

  mounted() {
    if (this.open) {
      this.teleportTarget.classList.add(backdropStyles.backdropOpen);
    } else {
      this.teleportTarget.classList.remove(backdropStyles.backdropOpen);
    }
  },

  beforeUnmount() {
    this.teleportTarget.classList.remove(backdropStyles.backdropOpen);
  },
};
</script>