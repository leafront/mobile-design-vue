<template>
  <div class="ui-toast-mask">
    <div class="ui-toast tc">
      <span class="fs30">{{ text }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  text: string
}

withDefaults(defineProps<Props>(), {
  text: '',
  required: true
})
</script>
