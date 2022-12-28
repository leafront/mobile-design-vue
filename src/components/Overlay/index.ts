import Overlay from './index.vue'

export default {
  install: (app) => {
    app.component('UiOverlay', Overlay)
  }
}
