import 'assets/css/splash.css'

document.addEventListener('contextmenu', e => {
  console.log('hf1', 'long press', e)
  var name = e.target.nodeName
  if (name === 'INPUT' || name === 'TEXTAREA') {
    e.stopPropagation()
  } else {
    e.preventDefault()
  }
})

function start () {
  require(['./main'], main => {
    main.start()
  })
}
if (window.cordova) {
  document.addEventListener('deviceready', () => {
    // 防止import组件时全局变量未初始化的情况
    start(true)
  }, false)
} else {
  start(false)
}
