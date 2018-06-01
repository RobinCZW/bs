import Vue from 'vue'
const FileTransfer = window.FileTransfer // Cordova插件  用于文件下载
const localStorage = window.localStorage
const LSKey = 'downloadManager'
const now = () => new Date().getTime()
function W (func, context = null) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      args.push(resolve)
      args.push(reject)
      try {
        func.apply(context || this, args)
      } catch (e) {
        reject(e)
      }
    })
  }
}
const resolveLocalFileSystemURLAsync = W(window.resolveLocalFileSystemURL)

function getStorageDir () { // Cordova用的路径  返回返回期末考啦创建的文件保存路径
  return resolveLocalFileSystemURLAsync('cdvfile://localhost/sdcard/')
    .then(dir => {
      const getDirectory = W(dir.getDirectory, dir)
      return getDirectory('期末考啦', {create: true})
    })
}
class Sson { // 让本地文件对象可以序列化成json格式数据 或 从json数据序列化成对象
  constructor () {
    this._fields = []
  }
  toJSON () {
    let obj = {}
    for (let f of this._fields) {
      obj[f] = this[f]
    }
    return obj
  }
  static fromJSON (Cls, val) {
    let obj = new Cls()
    for (let f of Object.keys(val)) {
      if (obj._fields.includes(f)) {
        obj[f] = val[f]
      }
    }
    return obj
  }
}
class FileItem extends Sson { // 文件对象 要存本地端的
  constructor () {
    super()
    this.filename = '' // 文件名
    this.path = '' // 路径
    this.md5 = '' // md5值
    this.lastOp = 0 // 最后操作时间
    this.size = 0 // 大小
    this.downTime = 0 // 下载时间
    this.nativeURL = '' // 本地路径
    this.failReason = ''
    this.transfer = null
    this.progress = { // 下载进度
      loaded: 0,
      total: 0
    }
    this._fields = [
      'filename',
      'path',
      'md5',
      'lastOp',
      'size',
      'downTime',
      'nativeURL',
      'failReason'
    ]
  }
  recordOpTime () { // 记录最后操作时间
    this.lastOp = now()
  }
  static fromJSON (val) {
    return super.fromJSON(FileItem, val)
  }
}
const DownloadManager = Vue.extend({ // DownLoadManager 定义
  name: 'download-manager',
  methods: {
    init () { // DownloadManager初始化就获取了本地的存储路径 dir
      if (!window.cordova) return
      return getStorageDir()
        .then(dir => {
          // window.dir = dir
          dir.getFileAsync = W(dir.getFile, dir)
          this.dir = dir
        })
    },
    deleteByMd5 (md5) { // 通过md5删除文件   也集成在DownloadManager里
      let chain = Promise.resolve()
      let task = this.byMd5[md5]
      if (task.transfer) {
        task.transfer.onprogress = null
        task.transfer.abort()
        task.transfer = null
      }
      if (task.nativeURL !== '') {
        chain = chain.then(() => resolveLocalFileSystemURLAsync(task.nativeURL))
          .then(fileEntry => {
            const remove = W(fileEntry.remove, fileEntry)
            return remove()
          })
      }
      chain = chain.then(() => {
        console.log('delete success', md5)
      }).catch(e => {
        console.log('delete failed', md5, e)
      }).then(() => {
        let index = this.items.indexOf(task)
        if (index > -1) {
          this.items.splice(index, 1)
        }
      })
      return chain
    },
    downloadFile (file, path, url) { // 下载文件    file是文件对象  path是服务器上的绝对文件路径 学校/课程/文件夹/文件名  url是oss真实下载地址
      /* file是文件对象 含以下信息
        size: "123", //单位: Byte
        name: "abc.txt",
        ctime: 1472185422506, //创建时间
        nick: "上传用户",
        uid: 1,
        md5: "xxxxx"
      */

      // window.open(url) 浏览器直接弹出下载

      let task = new FileItem() // 1.服务器端获取下来的文件信息 赋值给本地端文件对象task
      task.filename = file.name
      task.path = path
      task.md5 = file.md5
      task.lastOp = now()
      task.size = file.size
      task.progress = {
        loaded: 0,
        total: 1
      }
      this.items.push(task) // 2.要下载的文件先存入items   items是被watch的有更改就会调用 save()
      let transfer = new FileTransfer()
      transfer.onprogress = progressEvent => {
        task.progress.loaded = progressEvent.loaded
        task.progress.total = progressEvent.total
      }
      this.getDest(file).then(fileurl => { // 3.根据本地目录下载文件
        console.log('fileurl: ', fileurl)
        transfer.download( // 开始下载
          url,
          fileurl,
          r => {
            task.nativeURL = r.toURL()
            task.downTime = now()
          },
          e => {
            console.log(e)
            task.failReason = e
          }
        )
        task.transfer = transfer
      })
    },
    getDest (file) { // 返回本地路径+文件名        这个组合url可以访问到本地文件了
      // TODO 重名处理
      let i = 0
      let filenameGen = () => {
        const re = /^(.*?)(\.[^\.]+)$/
        if (i++ === 0) {
          return file.name
        } else {
          return file.name.replace(re, (_, pre, suf) => `${pre} (${i})${suf}`)
        }
      }
      let next = () => {
        let filename = filenameGen()
        console.log('try filename', filename)
        if (i > 100) {
          console.log('wtf? tried 100 times.')
          throw new Error('循环过多次')
        }
        return this.dir.getFileAsync(filename, {}).then(next, () => out(filename))
      }
      let out = filename => {
        console.log('got dest fileurl:', `${this.dir.nativeURL}/${filename}`)
        return `${this.dir.nativeURL}/${encodeURIComponent(filename)}`
      }

      return next()
      // return `${this.dir.nativeURL}/${file.name}`
    },
    save () { // items发生变化(也就是有新的要下载的文件加入items时),执行save 把items信息序列化成json文件存储. 之后每次DownloadManager初始化都先从json读取items,再将新文件加入items,再写入json
      let json = {
        items: this.items.map(i => i.toJSON()) // 已下载的文件对象集合items 每个文件对象都格式化成 JSON格式数据(此时还是对象)  存在 json文件里  key值是item 成 item[{},{},{},...]
      }
      localStorage.setItem(LSKey, JSON.stringify(json)) // 直接调用本地存储设置一个键值对 key是downloadManager  把存有已下载文件信息的 json数据 序列化成JSON字符串存储
    },
    load () { // 从本地存储中读取 文件信息  每次DownloadManager初始化的时候最先执行了load 把本地json存的items(已下载文件)都序列化出来存在items了,初始化完毕后DownloadManager又将新要下载的文件加入items再写入json
      // read from local storage
      let json = localStorage.getItem(LSKey)
      try {
        json = JSON.parse(json)
      } catch (e) {
        json = null
      }
      if (json) {
        this.items = json.items.map(i => FileItem.fromJSON(i))
        this.items = this.items.filter(i => i.nativeURL !== '')
      }
    }
  },
  computed: {
    byMd5 () { // items发生变化时  遍历items里每个file对象 新建一个map:   md5值:file对象   byMd5这个计算属性永远返回这个map 可通过md5值key访问到file对象
      let map = {}
      for (let file of this.items) {
        map[file.md5] = file
      }
      return map
    }
  },
  data () {
    return {
      items: [] // 下载的每个文件的信息 集合
    }
  },
  created () {
    this.load()
    // const self = this
    // const afterEach = () => {
    //   this.save()
    // }
    // const makeWrapper = func => {
    //   return function (...args) {
    //     func.apply(self, args)
    //     afterEach()
    //   }
    // }
    // const wrapList = ['downloadFile']
    // for (let i of wrapList) {
    //   this[i] = makeWrapper(this[i])
    // }
  },
  watch: {
    items: {
      handler: 'save',
      deep: true
    }
  }
})
let downloadManager = new DownloadManager()
window.DownloadManager = downloadManager
export default downloadManager
