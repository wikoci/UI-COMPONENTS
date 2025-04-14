<template>
  <div @mouseover="state.hover = true" @mouseleave="state.hover = false">
    <div>
      <slot
        :hover="state.hover"
        :toggle="() => (state.active = !state.active)"
        :close="() => (state.active = false)"
        :open="() => (state.active = true)"
        :active="state.active"
      ></slot>
    </div>
  </div>
</template>
<script setup>
const model = defineModel();
const state = reactive({
  active: false,
  hover: false,
});

watch(
  () => state.active,
  () => {
    model.value = state.active;
  }
);
</script>
