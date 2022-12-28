<template>
  <div
    v-show="show"
    class="ui-loading flex flex-v-center flex-h-center"
    :style="{ backgroundColor: bgColor }"
  >
    <div class="ui-loading__spinner flex">
      <svg viewBox="25 25 50 50" class="ui-loading__circular">
        <circle cx="50" cy="50" r="20" fill="none"></circle>
      </svg>
    </div>
    <span class="ui-loading__text fs28">加载中...</span>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  show: boolean
  bgColor: string
}

withDefaults(defineProps<Props>(), {
  show: false,
  bgColor: '#fff'
})
</script>
