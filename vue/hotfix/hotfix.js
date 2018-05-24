var R
function Ropt (path) {
  return R(path)._Ctor.options
}
function replaceTemplate (path, old, rep) {
  var component = Ropt(path)
  component.template = component.template.replace(old, rep)
}
function avoidDoubleBack () {
  var now = function () { return new Date().getTime() }
  var lastTime = now()
  var oldBack = window.history.back
  function onBack () {
    if (now() - lastTime < 100) {
      console.warn('ignore the quick second back, time:', now() - lastTime)
      return
    }
    lastTime = now()
    oldBack.call(window.history)
  }
  window.history.back = onBack
}

function patch1 () {
  console.log('hotfix version1')
  document.addEventListener('contextmenu', function (e) {
    console.log('hf1', 'long press', e)
    var name = e.target.nodeName
    if (name === 'INPUT' || name === 'TEXTAREA') {
      e.stopPropagation()
    } else {
      e.preventDefault()
    }
  }, true)
  Array.prototype.intersect = function (b) {
    var nVal = []
    this.forEach(function (i) {
      if (b.includes(i)) {
        nVal.push(i)
      }
    })
    return nVal
  }
  var course = Ropt('./pages/home/course.vue')
  course.filters.search = function (list) {
    var searchText = this.searchText.toLowerCase()
    var names = list.map(function (i) { return i.name.toLowerCase() })
    var searchChar = function (char) {
      return function (i) {
        return i.indexOf(char) !== -1
      }
    }
    if (searchText.length === 0) {
      return list
    } else {
      var sub = names.filter(searchChar(searchText[0]))
      for (var i=1; i<searchText.length; i++) {
        sub = sub.intersect( names.filter(searchChar(searchText[i])) )
      }
      return list.filter(function (i) { return sub.includes(i.name.toLowerCase()) })
    }
  }
  course.computed.showLoading = function () {
    return (this.searchText === '') && (this.visibleCount < this.folders.length)
  }
  var oldStr = '文件存储位置: sd卡/期末考啦/'
  var newStr = '文件存储位置: sd卡/期末考啦/<br />(建议使用WPS打开文档)'
  replaceTemplate('./components/file-detail.vue', /v-text="?hint"?/, 'v-html=hint')
  replaceTemplate('./pages/file.vue', oldStr, newStr)
  replaceTemplate('./pages/download-detail.vue', oldStr, newStr)
  avoidDoubleBack()
}

function patch2 () {
  console.log('hotfix version2')
  avoidDoubleBack()
}

function patch5 () {
  console.log('hotfix version5')
  var f = './pages/order/form.vue'
  replaceTemplate(f, '每天19:00-22:00配送每天19:00前下的打印订单', '订单只打印好装在信封放在每栋楼的一楼,需要自取,请留意订单状态')
  replaceTemplate(f, '网页端上传单面0.14元/张, 双面0.19元/张. App端更优惠', '每天19:00前下的订单当天送达, 其余第二天继续配送')
  replaceTemplate(f, '免配送费', '价格0.14元/单面   0.19元/双面   配送免费')
  replaceTemplate(f, '宿舍地址', '楼号宿舍床位')
  replaceTemplate(f, '如 1号楼 405', '如 1号楼405 D床')
  replaceTemplate(f, /<x-input.*?收货人.*?<\/x-input>/, '')
  Ropt(f).ready.push(function () {
    this.name = ' '
  })
}

window.hotfix = function hotfix (require, cb) {
  try {
    R = require
    switch (R('./manifest').default.version) {
      case 1:
        patch1()
        break
      case 2:
        patch2()
        break
      case 5:
        patch5()
        break
    }
  } catch (e) {}
  cb && cb()
}
