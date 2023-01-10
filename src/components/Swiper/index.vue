<template>
  <div class="ui-slideshow-wrapper ui-lazyLoad-pic" :style="{ height: itemHeight }">
    <div
      ref="bannerEle"
      class="ui-slideshow"
      @touchstart="touchstart"
      @touchmove="touchmove"
      @touchend="touchend"
    >
      <slot name="banner" :list="bannerList"></slot>
    </div>
    <slot name="dot"></slot>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, watch, onBeforeUnmount } from 'vue'
export default defineComponent({
  props: {
    index: {
      type: Number,
      default: 1
    },
    list: {
      type: Array,
      default: () => []
    },
    isAutoPlay: {
      type: Boolean,
      default: false
    },
    autoTime: {
      type: Number,
      default: 5000
    },
    itemWidth: {
      type: String,
      default: '750px'
    },
    itemHeight: {
      type: String,
      default: '500px'
    }
  },
  emits: ['toggleIndex'],
  setup(props, { emit }) {
    const bannerEle = ref<null | HTMLElement>(null)
    const startTime = ref<number>(0)
    const itemLength = ref<number>(0)
    const wrapperWidth = ref<number>(0)
    const startX = ref<number>(0)
    const startY = ref<number>(0)
    const endX = ref<number>(0)
    const endY = ref<number>(0)
    const moveX = ref<number>(0)
    const isValid = ref<boolean>(true)
    const autoPlayTimer = ref<null | number>(null)
    const bannerList = ref<any[]>([])

    watch(
      () => props.list,
      (newVal) => {
        const len = newVal.length
        const lastIndex = newVal[len - 1]
        const firstIndex = newVal[0]
        if (!len) {
          return
        }
        bannerList.value = [lastIndex, ...newVal, firstIndex]
        initialize()
      }
    )

    onBeforeUnmount(() => {
      clearInterval(autoPlayTimer.value)
    })

    const touchstart = (e) => {
      const point = e.touches ? e.touches[0] : e
      startX.value = endX.value = point.pageX
      startY.value = endY.value = point.pageY
      isValid.value = true
      stopAutoPlay()
      _start()
    }

    const touchmove = (e) => {
      if (!isValid.value) {
        return
      }
      const point = e.touches ? e.touches[0] : e
      endX.value = point.pageX
      endY.value = point.pageY
      const differX = endX.value - startX.value
      const differY = endY.value - startY.value
      const differXAbs = Math.abs(differX)
      const differYAbs = Math.abs(differY)
      if (differYAbs > differXAbs) {
        isValid.value = false
        return
      }
      e.preventDefault()
      _move(differX)
    }
    const touchend = () => {
      if (Math.abs(endX.value - startX.value) < 10) {
        return
      }
      if (!isValid.value) {
        return
      }
      _end()
    }
    const initialize = () => {
      startTime.value = new Date().getTime()
      itemLength.value = props.list.length
      wrapperWidth.value = parseFloat(props.itemWidth)
      setWrapperPos(-props.index * wrapperWidth.value)
      startAutoPlay()
    }

    const _start = () => {
      clearAnimate()
      const left = bannerEle.value.style.transform
      // left可能有小数
      moveX.value = parseInt(left.match(/\(([-\.\d]+)px,/)[1], 10)

      // 控制快速滑动
      if (new Date().getTime() - startTime.value < 300) {
        isValid.value = false
      }
    }
    const _move = (differX) => {
      setWrapperPos(moveX.value + differX)
    }
    const _end = () => {
      const bannerEleVal = bannerEle.value
      const left = bannerEleVal.style.transform
      const distance = -parseInt(left.match(/\(([-\.\d]+)px,/)[1], 10)
      const width = wrapperWidth.value
      if (startX.value > endX.value) {
        moveX.value = -Math.ceil(distance / width) * width
      } else {
        moveX.value = -Math.floor(distance / width) * width
      }
      bannerEleVal.style.transition = '300ms ease-in'
      setWrapperPos(moveX.value)
      let indexVal = Math.ceil(Math.abs(moveX.value / width))
      // 最后控制
      if (moveX.value >= 0) {
        indexVal = itemLength.value
        setTimeout(() => {
          clearAnimate()
          setWrapperPos(-itemLength.value * width)
        }, 300)
        startTime.value = new Date().getTime()
      } else if (Math.abs(moveX.value) >= (itemLength.value + 1) * width) {
        indexVal = 1
        setTimeout(() => {
          clearAnimate()
          setWrapperPos(-width * indexVal)
        }, 300)
        startTime.value = new Date().getTime()
      }
      emit('toggleIndex', indexVal)
      startAutoPlay()
    }
    const setWrapperPos = (x: number) => {
      const bannerEleVal = bannerEle.value
      bannerEleVal.style.transform = 'translate3d(' + x + 'px, 0, 0)'
    }
    const clearAnimate = () => {
      const bannerEleVal = bannerEle.value
      bannerEleVal.style.transition = 'none'
    }
    const autoPlay = () => {
      let autoIndex = props.index
      autoIndex++
      emit('toggleIndex', autoIndex)
      const autoMoveX = -autoIndex * wrapperWidth.value
      if (autoIndex > itemLength.value) {
        emit('toggleIndex', 1)
        setTimeout(() => {
          clearAnimate()
          setWrapperPos(-wrapperWidth.value)
        }, 310)
      }
      bannerEle.value.style.cssText =
        'transition:300ms ease-in; transform: translate3d(' + autoMoveX + 'px, 0, 0)'
    }
    const startAutoPlay = () => {
      if (props.isAutoPlay && itemLength.value > 1) {
        stopAutoPlay()
        autoPlayTimer.value = setInterval(() => autoPlay(), props.autoTime)
      }
    }
    const stopAutoPlay = () => {
      if (autoPlayTimer.value) {
        clearInterval(autoPlayTimer.value)
        autoPlayTimer.value = null
      }
    }
    return {
      touchstart,
      touchmove,
      touchend,
      bannerList,
      bannerEle,
      startTime,
      itemLength,
      wrapperWidth,
      startX,
      startY,
      endX,
      endY,
      moveX,
      isValid,
      autoPlayTimer
    }
  }
})
</script>
