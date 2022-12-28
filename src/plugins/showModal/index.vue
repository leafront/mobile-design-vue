<template>
  <div class="ui-mask">
    <div class="ui-showModal plr32 bgfff">
      <div v-if="title" class="ui-showModal-title tc">
        <h5 class="fs36 font-semiBold font-weight">{{ title }}</h5>
      </div>
      <div class="ui-showModal-cont tc">
        <p class="fs28 lh44" v-html="content"></p>
      </div>
      <div class="ui-showModal-submit fs32 flex flex-h-between">
        <span v-if="cancelButton" class="tc" @click="cancelCallback">{{ cancelText }}</span>
        <strong
          class="tc font-semiBold"
          :style="{ background: confirmColor }"
          :class="{ 'confirm-row': !cancelButton }"
          @click="successCallback"
          >{{ confirmText }}</strong
        >
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
interface Props {
  title: string
  content: string
  cancelButton?: boolean
  cancelText: string
  confirmText: string
  confirmColor?: string
  success(): void
  cancel(): void
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  content: '',
  cancelButton: true,
  cancelText: '取消',
  confirmText: '确定',
  confirmColor: 'var(--text-color)',
  success: () => {},
  cancel: () => {}
})

const successCallback = () => {
  props.success()
}
const cancelCallback = () => {
  props.cancel()
}
</script>
