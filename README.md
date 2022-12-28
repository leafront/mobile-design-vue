
npm install --save-dev @leafront/design-vue

## 常规项目代码目录

```
├── components
│   ├── Empty  //空状态组件
│   │    ├── index.ts  
│   │    └── index.vue
│   ├── Header //头部组件
│   │    ├── index.ts
│   │    └── index.vue
│   ├── Overlay  //遮罩层
│   │    ├── index.ts
│   │    └── index.vue
│   ├── PageLoading //底部loading
│   │    ├── index.ts
│   │    └── index.vue
│   │── ScrollList  //滚动加载列表
│   │    ├── index.ts
│   │    └── index.vue
│   │── Empty  //空状态组件
│   │    ├── index.ts
│   │    └── index.vue
├── css
│   ├── app.scss  //引用程序主样式
│   ├── index.scss  //入口样式
│   ├── reset.scss  //重置样式
│   ├── animate.scss //动画样式
│   ├── color.scss  //颜色样式
│   ├── ui-empty.scss  //空状态组件样式
│   ├── font.scss   //字体样式
│   ├── ui-header.scss  //公共头部组件样式
│   ├── ui-layout.scss  //布局样式
│   ├── ui-method.scss  //公共ui样式
│   ├── ui-overlay.scss  //弹层组件样式
│   ├── ui-page-loading.scss //页面底部loading样式
│   ├── ui-showLoading.scss  //页面全局loading样式
│   ├── ui-showModal.scss  //对话框提示样式
│   ├── ui-show-toast.scss    //提示框样式
├── librarys
│   ├── request.ts    // request 方法
│   ├── filter.ts  // 过滤器方法
│   ├── fun.ts   // 函数方法
│   ├── polyfill.ts  //polyfill 引入和重新js方法
│   ├── request.ts  // 请求接口方法
│   ├── store.ts   //localStorage、sessionStorage 方法
│   ├── utils.ts   // 公共方法
├── main.ts       //打包入口文件
├── plugins
│   ├── lazyLoad
│   │    └── index.ts  //懒加载
│   ├── loading       
│   │    ├── index.ts   //loading显示
│   │         └── index.vue
│   ├── showModal
│   │    ├── index.ts  //对话框
│   │         └── index.vue
│   │── showToast           //提示框
│   │    ├── index.ts
│   │    └── index.vue
├── serviceWorker.js            //serviceWorker 离线缓存
├── shims-global.d.ts
└── shims-vue.d.ts

```
##  plugins 插件使用
app.use(loading)
app.use(showToast)
app.use(showModal)
```

  import { getCurrentInstance } from "vue"
  const {
    proxy: { $showModal, $showToast, $showLoading, $hideLoading }
  } = getCurrentInstance() as any
  
  //提示对话框
  $showModal({
    title: "注销提示",
    content: "该门店已被认领，若不是您本人使用，请提交相关资料申诉",
    cancelText: "取消",
    confirmText: "申诉"
 })
 
 $showToast("请输入手机号")  //弱提示
 $showLoading()  //页面显示loading
 $hideLoading()  //页面隐藏loading 
```

##  lazyLoad 使用
```
  main.ts

  const app = createApp(App as any)
  app.directive("lazy", {
    mounted(el, binding, vnode) {
      setTimeout(() => {
        lazyLoad.init(el, binding, vnode)
      })
    }
  })

  <template>
    <div
      class="ui-lazyLoad-pic"
      v-lazy
      data-src="image"
    >
    </div>
  </template>

  <script lang="ts">
     
     import { defineComponent, onMounted, onBeforeUnmount } from "vue"
     import { lazyLoad } from "@mobile/design-vue"
     export default defineComponent({
       setup() {
         onMounted(() => {
            LazyLoad.start()
         })  
         onBeforeUnmount(() => {
            LazyLoad.remove()
         })
       }
     })      
  </script> 
 
```
## header 组件

```
  app.use(Header)
  <ui-header
    title="需求列表"
  >
  </ui-header>
```
| 参数名 | 描述 | 默认值 |
| :----:  | :----: | :----: |
| title | 标题 | 空 |
| backIcon | 返回按钮 | black 可选 white、black |
| rightTitle | 头部右边标题 | 空 |
| bgColor | 头部背景颜色 | 空 |
| statusBgColor | 状态栏背景颜色 | 空 |

## 空状态组件

```
  app.use(UiEmpty)
  <ui-empty
    title="暂时没有相关数据哦～"
    image="/h5-static/img/empty-bg.png"
  >
  </ui-empty>
```
| 参数名 | 描述 | 默认值 |
| :----:  | :----: | :----:  |
| title | 标题 | 暂时没有任何数据哦 |
| image | 图片地址 | /h5-static/img/empty-bg.png |

```
  app.use(PageLoading)
  <ui-page-loading></ui-page-loading> 底部loading
```
## 轮播图
```
  app.use(Swiper)
  <ui-swiper
    :list="bannerList"
    :index="index"
    :itemWidth="itemWidth"
    :itemHeight="itemHeight"
    @toggleIndex="toggleIndex"
  >
    <template #banner={list}>
      <ul class="slideshow-item" :style="{'height': itemHeight}">
        <li
          v-for="(item, $index) in list"
          :key="$index"
          :style="{
          'width': itemWidth,
          'backgroundImage': `url(${item.image})`
        }"
        >
        </li>
      </ul>
    </template>
    <template #dot>
      <ul class="slideshow-dots">
        <li
          v-for="(item, $index) in bannerList"
          :key="$index"
          :class="{ active: $index == index - 1 }"
        >
        </li>
      </ul>
    </template>
  </ui-swiper>
```

| 参数名 | 描述 | 默认值 |
| :----:  | :----: | :----: |
| index | 索引开始位置 | 1 |
| list | 列表array | [] |
| isAutoPlay | 是否自动播放 | false |
| autoTime | 自动播放时间 | 5000 |
| itemWidth | banner 宽度 | 750px |
| itemHeight | banner 宽度 | 500px |

## 日历日期

```
  <ui-date-picker
    :startDate="2020"
    :endDate="2022"
    v-model:show="show"
    v-model:value="dateValue"
  >
  </ui-date-picker>

```

| 参数名 | 描述 | 默认值 |
| :----:  | :----: | :----: |
| startDate | 开始日期 | 2010 |
| endDate | 结束日期 | 2021 |
| show | 是否显示 | false |
| dateValue | 默认显示日期 | {year: '2021', month: '01', date: '01'} |

## 城市地址

```
  <ui-address
    :list="list"
    v-model:show="show"
    v-model:value="dateValue"
  >
  </ui-address>

```

| 参数名 | 描述 | 默认值 |
| :----:  | :----: | :----: |
| list | 省市区列表 | [] |
| show | 是否显示 | false |
| value | 默认显示城市 | { provinceName: "北京市", cityName: "北京市",areaName: "东城区",provinceCode: "11",cityCode: "1101",areaCode: "110101" } |

## 遮罩层
```
  <ui-overlay
    v-model:show="show3"
    fadeIn="bottom"  
    closeButton="true"
  >
    <div class="test-overlay bgfff">1234342344</div>
  </ui-overlay>
```

| 参数名 | 描述 | 默认值 |
| :----:  | :----: | :----: |
| fadeIn | 显示方式 | center 可选center/bottom |
| show | 是否显示 | false |
| closeButton | 是否需要关闭按钮 | false |

## Storage 使用
```
  import { Store } from '@mobile/design-vue' 
  Store.set("name", {age: 1}, "local") //localStorage
  Store.get("name", "local")
  Store.set("name", {age: 1}, "session") //sessionStorage
  Store.get("name", "session")
```
