<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: string
    options: { label: string; value: string }[]
    name: string
    block?: boolean
  }>(),
  { block: false },
)

defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div class="inline-flex rounded-full bg-surface p-[3px]" :class="block ? 'w-full' : ''">
    <label
      v-for="opt in options"
      :key="opt.value"
      class="flex cursor-pointer items-center justify-center gap-1.5 rounded-full px-3 py-[7px] text-[13px]"
      :class="[modelValue === opt.value ? 'bg-accent text-bg' : '', block ? 'flex-1' : '']"
    >
      <input
        type="radio"
        :name="name"
        :value="opt.value"
        :checked="modelValue === opt.value"
        class="sr-only"
        @change="$emit('update:modelValue', opt.value)"
      >
      {{ opt.label }}
    </label>
  </div>
</template>
