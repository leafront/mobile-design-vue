<template>
  <div class="container">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted } from 'vue'
import { getPassiveValue, throttle } from '../../librarys/utils'
export default defineComponent({
  props: {
    finished: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:finished', 'update:loading', 'onLoad'],
  setup(props, { emit }) {

    const scrollLoadList = throttle(() => {
      const el: HTMLDivElement = document.querySelector('.scroll-view-wrapper')
      const elHeight = el.offsetHeight
      const scrollTop = el.scrollTop
      const scrollViewHeight = el.scrollHeight - 10
      if (elHeight + scrollTop >= scrollViewHeight && !props.finished) {
        emit('update:loading', true)
        emit('onLoad')
      }
    }, 800)

    const pageScrollList = () => {
      const isPassive: any = getPassiveValue()
      onBeforeUnmount(() => {
        window.removeEventListener('scroll', scrollLoadList, isPassive)
      })

      onMounted(() => {
        window.addEventListener('scroll', scrollLoadList, isPassive)
      })
    }

    pageScrollList()
  }
})
</script>
