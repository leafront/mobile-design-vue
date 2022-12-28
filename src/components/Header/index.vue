<template>
  <div v-if="isAppVal" class="ui-header-wrapper" :style="{ backgroundColor: bgColor }">
    <div ref="UiHeaderEl" class="ui-header">
      <div class="ui-header-state"></div>
      <div class="ui-header-info flex flex-h-between flex-v-center">
        <div class="ui-header-back flex flex-v-center" @click="backAction">
          <i :class="{ 'icon-close': backType == 2 }"></i>
        </div>
        <div class="ui-header-title flex flex-v-center flex-h-center">
          <span class="fs36 font-semiBold font-600">{{ title }}</span>
        </div>
        <slot name="right"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { isApp } from '../../librarys/utils'
import { useHeaderHeight } from '../../hooks/headerHeight'
import { useFixedElement } from '../../hooks/fixedElement'

export default defineComponent({
  props: {
    title: {
      type: String,
      default: ''
    },
    backType: {
      type: Number,
      default: 1
    },
    bgColor: {
      type: String,
      default: '#fff'
    }
  },
  setup(props, { attrs, emit }) {
    const UiHeaderEl = ref<HTMLDivElement>(null)
    const router = useRouter()
    const isAppVal = ref<boolean>(isApp)

    useHeaderHeight()
    useFixedElement(UiHeaderEl)

    const backAction = (): void => {
      if (attrs.onBackEvent) {
        emit('backEvent')
      } else {
        router.back()
      }
    }

    return {
      UiHeaderEl,
      isAppVal,
      backAction
    }
  }
})
</script>
