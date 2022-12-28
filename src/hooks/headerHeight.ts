import { ref } from 'vue'
import { getStatusBarHeight } from '../librarys/appBridge'
import { getFontSize, isApp } from '../librarys/utils'
import { localStore } from '../librarys/store'

export function useHeaderHeight(setContainerStyle = true) {
  const fontSize = getFontSize()
  const stateHeight = ref<number>(fontSize * 0.4)
  const headerHeight = ref<number>(fontSize * 0.88)
  const storeStatusHeight = Number(localStore.get('stateHeight'))

  const setHeaderHeight = (stateHeightVal): void => {
    const headerHeightVal = Number(stateHeightVal) + 0.88 * fontSize
    headerHeight.value = headerHeightVal
    stateHeight.value = stateHeightVal
    if (setContainerStyle && isApp) {
      const el = <HTMLElement>document.documentElement
      el.style.setProperty('--state-height', stateHeightVal + 'px')
      el.style.setProperty('--header-height', headerHeightVal + 'px')
    }
    if (!storeStatusHeight) {
      localStore.set('stateHeight', stateHeightVal)
    }
  }

  if (storeStatusHeight > 0) {
    setHeaderHeight(storeStatusHeight)
  } else {
    if (isApp) {
      getStatusBarHeight({}, (res) => {
        const data = JSON.parse(res)
        let appStateHeight = data.body.height
        if (navigator.userAgent.match(/SM-G9750/)) {
          appStateHeight += 60
        }
        setHeaderHeight(appStateHeight)
      })
    } else {
      setHeaderHeight(stateHeight.value)
    }
  }
}
