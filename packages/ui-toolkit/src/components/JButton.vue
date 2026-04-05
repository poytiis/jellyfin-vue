<template>
  <component
    :is="componentTag"
    :disabled="componentTag === 'button' ? disabled : undefined"
    :class="['uno-rounded-full hover:uno-brightness-105', sizeClasses, variantClass, stateClasses, className]"
    @click="onClick">
    <span
      v-if="$slots.default"
      class="uno-inline-flex uno-items-center uno-indent-[0.0892857143em] uno-uppercase
      uno-justify-center uno-whitespace-nowrap uno-tracking-[0.0892857143em] uno-font-500">
      <slot />
    </span>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const { disabled, class: className, variant, size, block, icon, color } = defineProps<{
  disabled?: boolean;
  class?: string;
  variant?: Variant;
  size?: Size;
  block?: boolean;
  icon?: boolean;
  color?: string;
}>();

const emit = defineEmits<(e: 'click', event: MouseEvent) => void>();

type Variant = 'elevated' | 'flat' | 'tonal' | 'outlined' | 'text' | 'plain';
type Size = 'x-small' | 'small' | 'default' | 'large' | 'x-large';

const componentTag = 'button';

const sizeClasses = computed(() => {
  if (typeof size === 'number') {
    return '';
  }

  switch (size) {
    case 'x-small': {
      return icon ? 'uno-h-7 uno-min-w-7 uno-text-xs' : 'uno-h-7 uno-px-2.5 uno-text-xs';
    }
    case 'small': {
      return icon ? 'uno-h-8 uno-min-w-8 uno-text-sm' : 'uno-h-8 uno-px-3 uno-text-sm';
    }
    case 'large': {
      return icon ? 'uno-h-11 uno-min-w-11 uno-text-base' : 'uno-h-11 uno-px-5 uno-text-base';
    }
    case 'x-large': {
      return icon ? 'uno-h-12 uno-min-w-12 uno-text-lg' : 'uno-h-12 uno-px-6 uno-text-lg';
    }
    default: {
      return icon ? 'uno-h-9 uno-min-w-9 uno-text-sm' : 'uno-h-9 uno-px-4 uno-text-sm';
    }
  }
});
const colorMap: Record<string, { solid: string; soft: string; text: string; ring: string }> = {
  primary: {
    solid: 'uno-bg-primary uno-text-white uno-color-white',
    soft: 'uno-bg-primary/12 uno-text-primary',
    text: 'uno-text-primary',
    ring: 'focus-visible:uno-ring-primary/45'
  },
  secondary: {
    solid: 'uno-bg-secondary uno-text-white',
    soft: 'uno-bg-secondary/12 uno-text-secondary',
    text: 'uno-text-secondary',
    ring: 'focus-visible:uno-ring-secondary/45'
  }
};

const palette = computed(() => {
  if (!color) {
    return colorMap.primary;
  }

  if (colorMap[color]) {
    return colorMap[color];
  }

  // Allows arbitrary UnoCSS color tokens, e.g. "emerald-600".
  return {
    solid: `bg-${color} text-white`,
    soft: `bg-${color}/12 text-${color}`,
    text: `text-${color}`,
    ring: `focus-visible:ring-${color}/45`
  };
});

const variantClass = computed(() => {
  switch (variant) {
    case 'flat':
    case 'elevated': {
      return `${palette.value?.solid} hover:brightness-95`;
    }
    case 'tonal': {
      return `${palette.value?.soft} hover:bg-opacity-18`;
    }
    case 'outlined': {
      return `bg-transparent ${palette.value?.text} hover:bg-current/6`;
    }
    case 'text': {
      return `bg-transparent ${palette.value?.text} hover:bg-current/6 border-transparent`;
    }
    case 'plain': {
      return 'bg-transparent text-inherit hover:bg-black/4 dark:hover:bg-white/6 border-transparent shadow-none';
    }
    default: {
      return `${palette.value?.solid} hover:brightness-95`;
    }
  }
});

const stateClasses = computed(() => [
  disabled ? `uno-bg-[color-mix(in_srgb,${palette.value?.solid}_50%,white)]` : '',
  block ? 'uno-w-full uno-justify-center' : 'uno-inline-flex'
].join(' '));

/**
 * Handle the button click.
 */
function onClick(event: MouseEvent) {
  if (disabled) {
    return;
  }

  emit('click', event);
}

</script>
