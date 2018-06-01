const Blob = window.Blob
const atob = window.atob
function dataURLtoBlob (dataurl) { // 头像转化成blob格式上传
  let arr = dataurl.split(',')
  let mime = arr[0].match(/:(.*?);/)[1]
  let bstr = atob(arr[1])
  arr = null
  let n = bstr.length
  let u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  dataurl = null
  bstr = null
  let blob = new Blob([u8arr], {type: mime})
  u8arr = null
  return blob
}

export {
  dataURLtoBlob
}
