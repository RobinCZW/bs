/*
let components = ['BackBtn', 'CheckBox', 'CommentItem', 'CrossBtn', 'Dropdown',
  'FeedItem', 'FileDetail', 'FileItem', 'FlexTextarea', 'IconItem', 'ImageClipper',
  'InputFile', 'LoadmoreBtn', 'PageBase', 'PageScroll', 'PicPreview', 'Popup',
  'SchoolPicker', 'SenderBar', 'TouchPicture', 'VueRipple']
*/
let installed = false
let components = ['BackBtn', 'CheckBox', 'CommentItem', 'CrossBtn', 'SmsCheck',
  'FeedItem', 'FileDetail', 'FileItem', 'FlexTextarea', 'IconItem', 'ImageClipper',
  'InputFile', 'LoadmoreBtn', 'PageBase', 'PageScroll', 'PicPreview', 'Popup',
  'SchoolPicker', 'SenderBar', 'TouchPicture', 'VueRipple', 'SearchBox', 'GoodItem']
function Name2ID (name) {
  const re = /([A-Z])/g
  return name.replace(re, a => '-' + a.toLowerCase()).substr(1)
}
components = components.map(name => require('./' + Name2ID(name)))

export default {
  install (Vue, options) {
    if (installed) {
      return
    }
    installed = true
    // Vue.component(BackBtn.name, BackBtn)
    components.forEach(component => {
      if (component.name) {
        Vue.component(component.name, component)
      } else {
        console.log('component doesn\'t have id', component)
      }
    })
  }
}
