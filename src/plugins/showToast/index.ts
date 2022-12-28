import { createVNode, render, App } from 'vue'
import Toast from './index.vue'

export default {
  install(app: App): void {
    let vm = null
    let isClick = true
    const container = document.createElement('div')
    app.config.globalProperties.$showToast = (text: string) => {
      if (!isClick) {
        return
      }

      if (!vm) {
        vm = createVNode(Toast as any, { text })
      }
      isClick = false
      render(vm, container)
      document.body.appendChild(container)
      setTimeout(() => {
        if (vm) {
          container.parentNode.removeChild(container)
          isClick = true
          vm = null
        }
      }, 2000)
    }
  }
}
