import { ref } from 'vue'
import { getFontSize } from '../librarys/utils'

export function useHeaderHeight() {
  const fontSize = getFontSize()
  const stateHeight = ref<number>(fontSize * 0.4)
  const headerHeight = ref<number>(fontSize * 0.88)

  const setHeaderHeight = (stateHeightVal): void => {
    const headerHeightVal = Number(stateHeightVal) + 0.88 * fontSize
    headerHeight.value = headerHeightVal
    stateHeight.value = stateHeightVal
  }
  setHeaderHeight(stateHeight.value)
}
