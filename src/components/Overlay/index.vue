<template>
  <div v-show="show">
    <div
      class="ui-mask"
      @touchmove="stopPopup($event)"
      @click="updateMaskOverlay($event, false)"
    ></div>
    <div
      class="ui-overlay-container"
      :class="{
        'ui-overlay-container-bottom': fadeIn == 'bottom',
        'ui-overlay-container-bottom-active': show && fadeIn == 'bottom',
        'ui-overlay-container-center': fadeIn == 'center',
        'ui-overlay-container-center-active': show && fadeIn == 'center'
      }"
    >
      <div
        v-if="closeButton && fadeIn == 'center'"
        class="ui-overlay-center-close"
        @click="updateOverlay($event, false)"
      >
        <i></i>
      </div>
      <div
        v-if="closeButton && fadeIn == 'bottom'"
        class="ui-overlay-bottom-close"
        @click="updateOverlay($event, false)"
      >
        <i></i>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  show: boolean
  fadeIn?: string
  closeButton?: boolean
  maskClick?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  fadeIn: 'center',
  closeButton: false,
  maskClick: true
})

const emits = defineEmits<{
  (e: 'updateOverlay', value: boolean): void
}>()

const stopPopup = (event) => {
  event.stopPropagation()
  event.preventDefault()
}
const updateOverlay = (event, val) => {
  event.stopPropagation()
  emits('updateOverlay', val)
}

const updateMaskOverlay = (event, val) => {
  if (props.maskClick) {
    updateOverlay(event, val)
  }
}
</script>
