<template>
  <div v-bind="ouiaProps" :class="[styles.toggleGroup, { [styles.modifiers.compact]: compact }]" role="group">
    <slot />
  </div>
</template>

<script lang="ts">
export const ToggleGroupDisabledKey = Symbol('ToggleGroupDisabledKey') as InjectionKey<ComputedRef<boolean | undefined>>;
export const ToggleGroupSelectionKey = Symbol('ToggleGroupSelectionKey') as InjectionKey<WritableComputedRef<unknown>>;

// TODO: readd `extends /* @vue-ignore */ Omit<HTMLAttributes, 'role'>` once https://github.com/vuejs/language-tools/issues/3723 is fixed
export interface Props<T> extends OUIAProps {
  /** Modifies the toggle group to include compact styling. */
  compact?: boolean;
  /** Disable all toggle group items under this component. */
  disabled?: boolean;

  modelValue?: T | null;
}

import { PfToggleGroup, PfToggleGroupItem } from '.';

export function useSingleToggleGroup<T>() {
  return [PfToggleGroup<T | undefined | null>, PfToggleGroupItem<T>];
}

export function useMultiToggleGroup<T>() {
  return [PfToggleGroup<T[]>, PfToggleGroupItem<T>];
}
</script>

<script lang="ts" setup generic="T = string | number | (string | number)[]">
import styles from '@patternfly/react-styles/css/components/ToggleGroup/toggle-group';
import { type InjectionKey, provide, computed, type ComputedRef, type WritableComputedRef } from 'vue';
import { useManagedProp } from '../../use';
import { useOUIAProps, type OUIAProps } from '../../helpers/ouia';

defineOptions({
  name: 'PfToggleGroup',
});

const props = defineProps<Props<T>>();
const ouiaProps = useOUIAProps({id: props.ouiaId, safe: props.ouiaSafe});

defineEmits<{
  (name: 'update:modelValue', value: T): void;
}>();

defineSlots<{
  default?: (props?: Record<never, never>) => any;
}>();

provide(ToggleGroupDisabledKey, computed(() => props.disabled));

const value = useManagedProp<T | null>('modelValue', null);
provide(ToggleGroupSelectionKey, value);
</script>
