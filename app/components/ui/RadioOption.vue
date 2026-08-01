<script setup lang="ts">
defineProps<{
  label: string
  subLabel?: string
  modelValue: string
  value: string
  name: string
}>()

defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <label
    class="flex cursor-pointer items-center gap-3.5 rounded-lg px-4 py-4"
    :class="modelValue === value ? 'bg-accent text-bg' : 'bg-surface text-ink'"
  >
    <input
      type="radio"
      :name="name"
      :value="value"
      :checked="modelValue === value"
      class="sr-only"
      @change="$emit('update:modelValue', value)"
    >
    <span
      class="h-[22px] w-[22px] flex-none rounded-full"
      :class="modelValue === value ? 'bg-bg shadow-[inset_0_0_0_4px_var(--color-accent)]' : 'border-2 border-ink/20'"
    />
    <span class="flex flex-col">
      <span class="font-semibold">{{ label }}</span>
      <span v-if="subLabel" class="text-xs" :class="modelValue === value ? 'opacity-75' : 'text-ink/50'">{{ subLabel }}</span>
    </span>
  </label>
</template>
