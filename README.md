# Dick.js

[![](https://img.shields.io/npm/l/@tarojs/taro.svg?style=flat-square)](https://www.npmjs.com/package/@tarojs/taro)
[![](https://img.shields.io/npm/dt/@tarojs/taro.svg?style=flat-square)](https://www.npmjs.com/package/@tarojs/taro)
[![](https://img.shields.io/travis/NervJS/taro.svg?style=flat-square)](https://travis-ci.org/NervJS/taro)

> 👽 dick [dɪk] ...

## 简介

**Dickjs** 是一套遵循ES6语法规范的小程序前端终极地狱解决方案。现如今市面上小程序框架的多种多样。dickjs是针对原生小程序中快速开发的解决方案，使用dickjs可以方便快捷开发小程序在实现逻辑上更加迅速。

## TODO

* □ Websocket


## DickVM.js 小程序ViewModel

#### 逻辑层

Taro 的语法规则基于 React 规范，它采用与 React 一致的组件化思想，组件生命周期与 React 保持一致，同时在书写体验上也尽量与 React 类似，支持使用 JSX 语法，让代码具有更丰富的表现力。

代码示例

```javascript
var vm = Page.VM({
  // 数据
  data: {
    model: 'dick.js'
  },
  // 计算属性
  computed: {
    upper: function(){
      return this.model.toUpperCase()
    }
  },
  // 方法
  methods: {
    change: function(name){
      this.model = 'hello ' + (name || 'world')
    }
  },
  // onLoad
  mounted: function(){
    vm.change()
  }
})
```

#### this

js内成员函数中的`this`指向`data`,并且`computed`和 `methods`的成员也可以通过`this`进行访问、取值

#### 小程序内无须setData

直接通过`this`进行修改数据，页面会自动更新视图

`var vm = Page.VM()`返回`this`，方便在异步函数内直接使用`vm`

#### mounted

`mounted`函数映射为小程序内`onLoad`函数

#### 控制台调试

在开发工具控制台可以通过`Page.vm`访问当前页面的`vm`，方便调试

```javascript
Page.vm.model = 'dick.js'
```

#### wxml传参给js

原生小程序事件处理函数不能直接传参，有且只有事件对象作为参数，
但要传递参数时只能能过`data-x="{{'value'}}"`，然后`event.target.dataset`的方式获取，为了方便将`dataset`作为第二个参数传给js处理函数。另外，实际上大多数情况我们并不会用到`event`，所以如果存在`data-e`时，将代替`event`直接作为处理函数的参数

```javascript
handler(dataset.e||event, dataset)
```

#### 双向绑定

小程序没有直接进行双向绑定，通语法糖实现

**view->model:** 通过`data-model`实现视图层到逻辑层的数据修改

**model->view:** 逻辑层到视图层的数据传递为原生小程序的`value="{{model}}"`

```html
<input bindinput="$model" data-model="model" value="{{model}}></input>
```

`data-model`支持复杂的层级，如：`data-model="form.list[0].name"`

#### 使用方法

1. 在入口文件`app.js`中引入[dick.js](https://github.com/lhz1208/Dick.js)
```javascript
require('./mpvm.js')
```
2. 在页面js中直接使用
```javascript
Page.VM(e){}
```

## DickZXY.js 小程序知晓云api封装

#### ✅查询列表

```javascript
let LIST = new SELECT(CONFIG.ID,CONDITION, 10, 0, `-created_at`)
LIST.select().then(res => this.LISTDATA = res)
```
构建参数

1. 表ID
2. 查询条件
3. 查询数量limit
4. 偏移量offset
5. 排序方式

#### ✅查询单值
```javascript
let ITEM = new SelectTable(CONFIG.ID, RECORDID, null, null, ``)
selectNews.select().then(res => this.ITEM = res)
```
构建参数

1. 表ID
2. 记录ID

#### ✅添加记录
```javascript
let RECORD = {
    id : id,
    name : name,
}
let RESULT = new InsertRecord(CONFIG.ID, RECORD)
insertRecord.insert().then(res => {...})
```

 









## 开发计划

[开发计划]

## 更新日志

本项目遵从 [Angular Style Commit Message Conventions](https://gist.github.com/stephenparish/9941e89d80e2bc58a153)，更新日志由 `conventional-changelog` 自动生成。完整日志请点击 [CHANGELOG.md](./CHANGELOG.md)。

## 开发交流



## License

MIT License

Copyright (c) 2018 O2Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.