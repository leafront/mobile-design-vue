import { onUnmounted } from 'vue'
import { isIOS, isApp } from '../librarys/utils'

export const useFixedElement = (el) => {
  if (!isApp) {
    return
  }
  function fixedNav() {
    setTimeout(() => {
      const viewport = window.visualViewport
      el.value.style.transform = `translateY(${viewport.offsetTop}px)`
    }, 500)
  }
  function restoreNav() {
    setTimeout(() => {
      el.value.style.transform = `translateY(0)`
    }, 100)
  }
  if (isIOS) {
    window.addEventListener('focusin', fixedNav)
    window.addEventListener('touchmove', restoreNav)
    window.addEventListener('focusout', restoreNav)
  }
  onUnmounted(() => {
    if (isIOS) {
      window.removeEventListener('focusin', fixedNav)
      window.removeEventListener('touchmove', restoreNav)
      window.removeEventListener('focusout', restoreNav)
    }
  })
}
