const Image = window.Image
let width = window.screen.width
let height = window.screen.height
let vmax = width > height ? width : height
let vmin = width > height ? height : width
vmin
function createCanvas (len) {
  let canvas = document.createElement('canvas')
  canvas.width = canvas.height = vmax
  // document.body.appendChild(canvas)
  return canvas
}
function deleteCanvas (canvas) {
  // document.body.removeChild(canvas)
}
function resizeToScreenMax (src, cb) {
  let canvas = createCanvas()
  let image = new Image()
  image.onload = () => {
    console.log('resize loaded')
    let width = image.width
    let height = image.height
    let r = 1
    if (width > height) {
      r = vmax / height
    } else {
      r = vmax / width
    }
    canvas.width = width * r
    canvas.height = height * r

    let ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
    cb(canvas.toDataURL('image/jpeg', 1))
    deleteCanvas(canvas)
    ctx = null
    canvas = null
    image = null
  }
  image.src = src
}
function clipImage (src, sx, sy, sw, sh, dw, dh, q = 1, cb = null) {
  let canvas = createCanvas()
  let image = new Image()
  image.onload = () => {
    // let width = image.width
    // let height = image.height
    canvas.width = dw
    canvas.height = dh

    let ctx = canvas.getContext('2d')

    // ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#808080'
    ctx.fillRect(0, 0, dw, dh)
    ctx.drawImage(image, sx, sy, sw, sh, 0, 0, dw, dh)
    cb && cb(canvas.toDataURL('image/jpeg', q))
    deleteCanvas(canvas)

    ctx = null
    canvas = null
    image = null
  }
  image.src = src
}
export {
  resizeToScreenMax,
  clipImage
}
