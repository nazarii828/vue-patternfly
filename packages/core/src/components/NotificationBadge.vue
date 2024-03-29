<template>
  <pf-button v-bind="ouiaProps" variant="plain">
    <span :class="[styles.notificationBadge, styles.modifiers[variant], {[styles.modifiers.expanded]: expanded}]">
      <slot>
        <pf-attention-bell-icon v-if="variant === 'attention'" />
        <pf-bell-icon v-else />
      </slot>
      <span v-if="count > 0" :class="styles.notificationBadgeCount">{{ count }}</span>
    </span>
  </pf-button>
</template>

<script lang="ts" setup>
import styles from '@patternfly/react-styles/css/components/NotificationBadge/notification-badge';
import type { ComponentProps } from '../util';
import PfButton from './Button.vue';
import PfBellIcon from '@vue-patternfly/icons/bell-icon';
import PfAttentionBellIcon from '@vue-patternfly/icons/attention-bell-icon';
import { useOUIAProps } from '../helpers/ouia';

defineOptions({
  name: 'PfNotificationBadge',
});

export interface Props extends /* @vue-ignore */ Omit<ComponentProps<typeof PfButton>, 'variant'> {
  /** Determines the variant of the notification badge */
  variant?: 'read' | 'unread' | 'attention';

  /** A number displayed in the badge alongside the icon */
  count?: number;

  /** Flag for applying expanded styling and setting the aria-expanded attribute on the
   * notification badge.
   */
  expanded?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'unread',
  count: 0,
});
const ouiaProps = useOUIAProps({id: props.ouiaId, safe: props.ouiaSafe});

defineSlots<{
  default?: (props?: Record<never, never>) => any;
}>();
</script>
