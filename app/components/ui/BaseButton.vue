<script setup lang="ts">
type Variant = 'primary' | 'secondary' | 'ghost' | 'icon'

withDefaults(
  defineProps<{
    variant?: Variant
    block?: boolean
    type?: 'button' | 'submit'
  }>(),
  {
    variant: 'primary',
    block: false,
    type: 'button',
  },
)
</script>

<template>
  <button
    :type="type"
    class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-heading font-normal leading-tight disabled:cursor-not-allowed disabled:opacity-45"
    :class="[
      block ? 'w-full justify-center px-5 py-3.5 text-[15px]' : 'px-[18px] py-2.5 text-sm',
      variant === 'primary' && 'bg-accent text-bg hover:bg-accent-600 active:bg-accent-700',
      variant === 'secondary' && 'border border-ink/16 text-ink hover:bg-ink/5 active:bg-ink/10',
      variant === 'ghost' && 'px-1 text-accent-2 hover:bg-accent-2/10 active:bg-accent-2/18',
      variant === 'icon' && 'h-[38px] w-[38px] border border-ink/16 p-0 hover:bg-ink/5 active:bg-ink/10',
    ]"
  >
    <slot />
    <span v-if="$slots.icon"><slot name="icon" /></span>
  </button>
</template>
