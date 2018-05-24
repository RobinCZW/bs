const folderIcon = require('assets/icon/file/folder.png')
const unknownIcon = require('assets/icon/file/other.png')
const extMap = {
  'doc|docx|wps': 'doc.png',
  'xls|xlsx': 'xls.png',
  'txt': 'txt.png',
  'ppt|pptx': 'ppt.png',
  'pdf': 'pdf.png',
  'mp4|flv|mkv|avi': 'video.png',
  'jpe?g|png|gif|bmp|psd': 'img.png',
  'zip|rar|7z|gz': 'zip.png'
}
const extAry = Object.keys(extMap).map(i => ({
  re: new RegExp(i, 'i'),
  url: require('assets/icon/file/' + extMap[i])
}))
function getTypeUrl (filename) { // 返回文件类型的图片(的路径)  例如 doc.png
  let extName = ''
  let ret = /\.([^\.]*)$/.exec(filename)
  if (ret) {
    extName = ret[1]
  }

  ret = extAry.find(i => i.re.test(extName))
  if (ret) {
    return ret.url
  } else {
    return unknownIcon
  }
}
function displaySize (size) {
  if (!size) return ''
  if (size < 1024 * 1024) { // 1M
    return Math.ceil(size / 1024) + ' KB'
  } else if (size < 1024 * 1024 * 1024) { // 1G
    return Math.ceil(size / 1024 / 1024) + ' MB'
  } else {
    return Math.ceil(size / 1024 / 1024 / 1024) + ' GB'
  }
}
export {
  folderIcon,
  getTypeUrl,
  displaySize
}
