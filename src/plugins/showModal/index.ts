import { createVNode, render, App } from 'vue'
import Modal from './index.vue'

export default {
  install(app: App): void {
    let vm = null
    let isClick = true
    const container = document.createElement('div')
    app.config.globalProperties.$showModal = ({
      title,
      content,
      cancelText,
      confirmText,
      confirmColor,
      cancelButton
    }) => {
      return new Promise<string>((resolve, reject) => {
        if (!isClick) {
          return
        }
        if (!vm) {
          vm = createVNode(Modal as any, {
            title,
            content,
            cancelText,
            confirmText,
            confirmColor,
            cancelButton,
            success: () => {
              if (vm) {
                container.parentNode.removeChild(container)
                isClick = true
                vm = null
                resolve('success')
              }
            },
            cancel: () => {
              if (vm) {
                container.parentNode.removeChild(container)
                isClick = true
                vm = null
                reject('cancel')
              }
            }
          })
        }
        isClick = false
        render(vm, container)
        document.body.appendChild(container)
      })
    }
  }
}
