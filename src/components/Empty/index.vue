<template>
  <div class="ui-empty flex-column flex-v-center flex-h-center">
    <div v-if="image" class="ui-empty-pic" :style="{ backgroundImage: `url(${image})` }"></div>
    <div v-else class="ui-empty-pic"></div>
    <span class="lh44 fs28">{{ title }}</span>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  title?: string
  image?: string
}

withDefaults(defineProps<Props>(), {
  title: '暂时没有任何数据哦',
  image: ''
})
</script>
