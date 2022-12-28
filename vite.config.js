import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import shell from 'rollup-plugin-shell'
const designVueV = require('./package.json').version

const exportDesignVuePath = `./dist/h5-static/design-vue@${designVueV}/design-vue.es.prod.js`

const banner = `/*!
  * design-vue.js v${designVueV}
  * Copyright(c) 2013-${new Date().getFullYear()}
  * Released under the MIT License.
  */`

export default defineConfig({
  plugins: [
    vue(),
    shell({ commands: [
        'sudo rm -rf dist',
        `npm pkg set main="${exportDesignVuePath}" module="${exportDesignVuePath}" exports["."]="${exportDesignVuePath}"`,
      ], hook: 'buildStart' }),
  ],
  build: {
    polyfillModulePreload: false,
    rollupOptions: {
      // 请确保外部化那些你的库中不需要的依赖
      external: ['vue', 'vue-router'],
      output: {
        dir: `./dist/h5-static/design-vue@${designVueV}`,
        banner,
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          "vue": "Vue",
          "vue-router": "VueRouter",
          'pinia': "Pinia"
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    lib: {
      entry: 'src/main.ts',
      name: 'mobileDesignVue',
      fileName: (format) => {
        format = format.replace(/umd/, 'global')
        return `design-vue.${format}.prod.js`
      },
      formats: ['umd', 'es']
    },
    cssCodeSplit: false
  }
})

