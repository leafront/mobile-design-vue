const fs = require('fs')
const sass = require('sass')
const postcss = require('postcss')
const pxtorem = require('postcss-pxtorem')
const { execSync } = require('child_process')
const designVueV = require('./package.json').version

const comment = '/*!\n' +
  ` * design-vue.css  v${designVueV} \n` +
  ` * Copyright(c) 2013-${new Date().getFullYear()} \n` +
  ' * Released under the MIT License.\n' +
  ' */\n'

const compressed = sass.compile('./src/css/index.scss', {style: "compressed"})

const options = {
  rootValue: 100,
  unitPrecision: 5,
  propList: ['*'],
  replace: true,
  mediaQuery: false,
  minPixelValue: 0
}
const processedCss = postcss(pxtorem(options)).process(compressed.css).css;

execSync(`mkdir -m 0777 -p ./dist/h5-static/css/design-vue@${designVueV}`)

fs.writeFile(`./dist/h5-static/css/design-vue@${designVueV}/index.css`, comment + processedCss, 'utf-8', () => {
  try {
    console.log('scss打包成功')
  } catch (e) {
    console.log('写入内容失败', e)
  }
})
