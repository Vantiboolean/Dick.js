Page.VM = function(options) {
  return new VM(options)
}

function VM(options) {

  // vm data
  var data = this
  VM.assign(this, options)

  // proxy
  var proxy = VM.getProxy(data)

  // methods
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      ! function(fn) {
        if (typeof fn == 'function') {
          // bind proxy, computed
          var $fn = VM.inject(proxy, fn)
          data[key] = $fn
          // Page methods
          options[key] = $fn
        }
      }(data[key])
    }
  }

  // onLoad
  options.mounted = options.mounted || options.onLoad
  options.onLoad = function() {
    var self = this
    var args = arguments

    // $page
    data.$app = getApp()
    data.$page = this
    data.$route = this.route

    // mounted
    options.mounted && options.mounted.apply(self, args)
  }

  // onShow
  var _onShow = options.onShow
  options.onShow = function() {
    _onShow && _onShow.apply(this, arguments)
    // 首次||恢复当前页时更新一次视图
    data.$render()
    // dev
    Page[this.route] = this
    Page.page = this
    Page.options = options
    Page.data = data
    Page.vm = proxy
  }

  // $model
  // bindinput="$model" data-model="model" value="{{model}}"
  options.$model = function(e) {
    var vm = proxy
    var path = e.currentTarget.dataset.model
    path = path.replace(/\]/g, '')
    path = path.split(/[.[]/)
    var obj = vm
    for (var i = 0; i < path.length - 1; i++) {
      var key = path[i]
      obj = obj[key]
    }
    var key = path[path.length - 1]

    obj[key] = e.detail.value
  }

  // init
  // 小程序每次进入页面时会对options.data进行一次stringify传到视图层
  options.data = {}
  Page(options)

  // return proxy
  return proxy
}

// options.fn, comupted, methods -> this
VM.assign = function(data, options) {
  var _options = Object.assign({}, options)
  delete _options.data
  delete _options.methods
  delete _options.computed
  Object.assign(data,
    options.data,
    options.methods,
    options.computed,
    _options,
  )
  for (var key in options.computed) {
    var fn = options.computed[key]
    if (typeof fn == 'function') {
      fn.isComputed = true
    }
  }
}

// bind this, computed, handler(dataset.e||e, dataset)
VM.inject = function(vm, fn) {
  var $fn = function(e) {
    var args = arguments

    // handler(dataset.e||e, dataset)
    if (!this.$page) { // by view
      if (e && e.currentTarget) {
        var dataset = e.currentTarget.dataset || {}
        args = []
        args[0] = e
        args[1] = dataset
        if ('e' in dataset) {
          args[0] = dataset.e
        }
        if('args' in dataset){
          args = dataset.args
        }
      }
    }

    // bind this, result
    return fn.apply(vm, args)
  }

  // computed
  if (fn.isComputed) {
    $fn.toJSON = $fn.toString = $fn.valueOf = function() {
      // toJSON->fn():model:proxy->$render!!(noRender)->setData->toJSON
      VM.noRender = true
      var rs = fn.call(vm)
      VM.noRender = false
      return rs
    }
  }

  // old
  $fn.fn = fn

  return $fn
}

// trigger $render
VM.getProxy = function(data) {
  var proxy = {}
  for (var key in data) {
    ! function(key) {
      proxy[key] = data[key]
      Object.defineProperty(proxy, key, {
        get: function() {
          data.$render()
          return data[key]
        },
        set: function(value) {
          data[key] = value
          data.$render()
        }
      })
    }(key)
  }
  return proxy
}

// prototype
VM.prototype = {
  $app: null,
  $page: null,
  $route: '',
  setData: function() {
    var $page = this.$page
    $page.setData.apply($page, arguments)
  },
  $foceUpdate: function() {
    // console.log('$foceUpdate')
    var vm = this
    // newData
    var newData = {}
    for (var key in vm) {
      ! function(value) {
        if (typeof value == 'function') { // computed
          var fun = value.fn || value
          if (!fun.isComputed) {
            return
          }
        }
        if (value === undefined) { // fix setData undefined
          value = ''
        }
        newData[key] = value
      }(vm[key])
    }

    // protected
    delete newData.$page // --console.warn
    delete newData.$app
    // console.log('newData', vm, newData)

    // update view
    vm.setData(newData)
  },
  $render: function() {
    if (VM.noRender) return

    // 非当前页不更新视图
    var pages = getCurrentPages()
    if (this.$page != pages[pages.length - 1]) return

    var self = this
    clearTimeout(this.$render.timer)
    this.$render.timer = setTimeout(function() {
      self.$foceUpdate()
    }, 1)
  },
}

module.exports = VM