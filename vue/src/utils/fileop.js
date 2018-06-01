import { getMIMEByName } from 'utils/mime'
const plugins = window.plugins
function b64 (text) {
  return window.btoa(unescape(encodeURIComponent(text)))
}
function genURL (title, text, url) {
  return `mqqapi://share/to_qqdataline?src_type=app&version=1&file_type=news&app_name=${b64(title)}&req_type=${b64('6')}&description=${b64(text)}`
  /*
  mqqapi://share/to_fri?
  src_type=app&
  version=1&
  file_type=news&
  title=5ZOI5ZOI5ZOI&
  description=5ZG15ZG15ZG1&
  share_id=222222&&
  url=aHR0cDovL2p3Y2guZnp1LmVkdS5jbi8=&
  app_name=5b6u5L+h&
  req_type=MQ==&
  cflag=MA==
  */
  // return `mqqapi://share/to_fri?src_type=app&version=1&file_type=news&cflag=${b64(0)}&share_id=2222222&title=${b64(title)}&app_name=${b64(title)}&req_type=${b64('1')}&description=${b64(text)}&url=${b64(url)}`
}
function checkPlugin () {
  return plugins && plugins.webintent
}
export function sendToMyCompouter (text, url) { // 发送到电脑
  if (!checkPlugin()) return
  let surl = genURL('期末考啦', text, url) // genURL定义在上面 surl已经带了qq的api的链接 这里传入本app名 文本 文本链接
  console.log('openurl: ', surl)
  return plugins.webintent.startActivity({
    action: plugins.webintent.ACTION_VIEW,
    url: surl // 这个url决定唤起什么   唤起qq分享的界面
  }, r => null, e => {
    throw new Error('启动QQ失败')
  })
}
export function openWithUrl (url) { // 调用本地能打开此文件的app打开 (用户可选择wps)
  let type = getMIMEByName(decodeURIComponent(url)) // 是根据mime对照表查 一种文件 由哪种软件 打开的   系统会弹出选择框 列出所有能打开的app
  // console.log(url, decodeURIComponent(url), type)
  plugins.webintent.startActivity({
    action: plugins.webintent.ACTION_VIEW,
    url: url,
    type
  }, r => null, e => {
    throw new Error('打开文件失败')
  })
}
// plugins.webintent.startActivity({action: plugins.webintent.ACTION_VIEW, url: sendToMyCompouter('http://finalexam.cn/1.txt')})
