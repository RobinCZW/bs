/*eslint eqeqeq: "off"*/
import moment from 'moment'
import uuid from 'uuid'

const CountPerPage = 20
const FormData = window.FormData
const u2l = {
  topic (topic) {
    return {
      name: topic.name,
      desc: topic.description,
      icon: topic.icon_urls['160'],
      id: topic.id
    }
  },
  creator (creator, anonymous) {
    const aboy = require('assets/icon/xsq/aboy.png')
    const agirl = require('assets/icon/xsq/agirl.png')
    let item = {
      id: creator.id,
      nickname: creator.name,
      avatar: creator.icon_url['240'],
      gender: creator.gender,
      school: creator.custom,
      anonymous: anonymous
    }
    if (anonymous) {
      item.nickname = '匿名同学'
      if (creator.gender == 1) {
        item.avatar = aboy
      } else {
        item.avatar = agirl
      }
    }
    return item
  },
  feed (feed) {
    let ext = {
      a: 0
    }
    try {
      ext = JSON.parse(feed.custom)
    } catch (e) {}
    if (typeof ext !== 'object') {
      ext = {a: feed.custom}
    }

    return {
      id: feed.id,
      content: feed.content,

      creator: u2l.creator(feed.creator, ext.a == 1),

      likeCount: feed.likes_count,
      hasFavorite: feed.has_collected,
      commentCount: feed.comments_count,

      imgs: feed.image_urls,

      liked: feed.liked,
      collected: feed.has_collected,

      create_time: moment(feed.create_time).toDate(),
      ext: ext,
      title: feed.title
    }
  },
  comment (comment) {
    let ext = {
      a: 0
    }
    try {
      ext = JSON.parse(comment.custom)
    } catch (e) {}
    if (typeof ext !== 'object') {
      ext = {a: comment.custom}
    }
    // console.log(comment, typeof comment)
    let replyComment = comment.reply_comment
    let replyTo = null
    if (replyComment && !Array.isArray(replyComment)) {
      replyComment = u2l.comment(replyComment)
      replyTo = {
        creator: replyComment.creator,
        content: replyComment.content,
        id: replyComment.id
      }
    } else {
      replyTo = null
    }
    return {
      id: comment.id,
      content: comment.content,

      creator: u2l.creator(comment.creator, ext.a == 1),

      replyComment: replyComment,
      replyTo: replyTo,
      deleted: comment.status === 3,

      create_time: moment(comment.create_time).toDate(),
      ext: ext
    }
  },
  mycomment (mycomment) {
    let item = u2l.comment(mycomment)
    let feed = u2l.feed(mycomment.feed)
    item.replyTo = {
      creator: feed.creator,
      content: feed.content,
      id: feed.id
    }
    item.feed = feed
    return item
  }
}

function parseNavigator (nav) {
  const re = /(\w+)=([^&]*)/g
  let i = null
  let out = {}
  while (i = re.exec(nav)) { // eslint-disable-line
    out[i[1]] = i[2]
  }
  return out
}

export default function (http, $http) {
  // const urlRoot = 'https://rest.wsq.umeng.com'
  let urlRoot = 'http://api.wsq.umeng.com'
  if (process.env.NODE_ENV === 'development') {
    urlRoot = 'umeng'
  }
  // urlRoot = 'umeng'
  const appKey = '57e3eb51e0f55ab0720021e5'

  http.interceptors.push((request, next) => {
    if (request.url.startsWith(urlRoot)) {
      if (xsq.accessToken !== null) {
        request.headers.set('accesstoken', xsq.accessToken)
      }
      request.emulateJSON = true
      request.params['ak'] = appKey
      // console.log('request', request.url, request.body)
      next(response => {
        if (response.body.navigator) {
          let next = parseNavigator(response.body.navigator)
          response.body.next = next
        } else {
          response.body.next = null
        }
        if (response.body.err_code === 50005) {
          // TODO: 重新登录
        }
        if (response.body.err_code) {
          let r = response.body
          response.status = r.err_code
          response.statusText = r.err_msg
          response.ok = false
          this.utils.toast('学生圈出错啦')
        }
      })
      return
    }
    next()
  })

  let before = (key) => {
    console.log('xsq before', key)
    let chain = Promise.resolve()
    if (this.user.store.isLogin && xsq.accessToken === null) {
      chain = chain.then(xsq.login)
    } else if ((new Date()).getTime() > xsq._accessTokenExpire) {
      chain = chain.then(xsq.login)
    }
    return chain
  }
  let after = (r) => {
    if (r) {
      if (r.body) {
        return r.body
      }
    }
    return r
  }

  let xsq = {
    deps: ['user'],
    init ({ user }) {
      console.log('xsq init', user)
      this.user = user
      return this.login()
    },
    store: {
      // topic: {},
      topicList: [],
      feedList: [],
      commentList: []
    },
    _accessToken: null,
    _accessTokenExpire: 0,
    get accessToken () {
      return this._accessToken
    },
    set accessToken (val) {
      this._accessTokenExpire = (new Date()).getTime() + 60 * 60 * 1000
      this._accessToken = val
    },
    login () {
      if (!xsq.user.store.isLogin) return
      return xsq.user.xsqToken().then(r => {
        console.log('xsq login user', r)
        console.log('access_token', r.access_token)
        xsq.uid = r.id
        xsq.accessToken = r.access_token
        return r
      }).catch(e => {
        console.error('xsq err', e)
      })
    },
    logout () {
      xsq.uid = null
      xsq.accessToken = null
    },
    updateInfo () {
      return xsq.login()
        .then(xsq.user.info)
        .then(info => {
          return $http.put(`${urlRoot}/v2/user/profile`, {
            custom: info.collegeName,
            gender: info.gender === '男' ? '1' : '0',
            name: info.nickname,
            name_l: 'no_restrict',
            name_p: 'no_restrict'
          })
        })
    },
    listTopic (next) {
      return $http.get(`${urlRoot}/v2/topics/`, {
        params: next || {
          count: CountPerPage,
          page: 1
        }
      }).then(r => {
        let topics = r.body.items
        topics = topics.map(u2l.topic)
        if (!next) {
          xsq.store.topicList = []
        }
        xsq.store.topicList = xsq.store.topicList.concat(topics)
        console.log(r.body)
        return r
      })
    },
    listFeed (tid, next) {
      return $http.get(`${urlRoot}/v2/topic/feeds`, {
        params: next || {
          topic_id: tid,
          count: CountPerPage,
          page: 1
        }
      }).then(r => {
        let feeds = r.body.items
        feeds = feeds.map(u2l.feed)
        if (!next) {
          xsq.store.feedList = []
        }
        xsq.store.feedList = xsq.store.feedList.concat(feeds)
        return r
      })
    },
    listMyFeed (next) {
      return $http.get(`${urlRoot}/v2/user/timeline`, {
        params: next || {
          count: CountPerPage,
          page: 1
        }
      }).then(r => {
        let feeds = r.body.items
        feeds = feeds.map(u2l.feed)
        if (!next) {
          xsq.store.feedList = []
        }
        xsq.store.feedList = xsq.store.feedList.concat(feeds)
        return r
      })
    },
    listMyFav (next) {
      return $http.get(`${urlRoot}/v2/user/favourites`, {
        params: next || {
          count: CountPerPage,
          page: 1
        }
      }).then(r => {
        let feeds = r.body.items
        feeds = feeds.map(u2l.feed)
        if (!next) {
          xsq.store.feedList = []
        }
        xsq.store.feedList = xsq.store.feedList.concat(feeds)
        return r
      })
    },
    listComment (feedId, next) {
      return $http.get(`${urlRoot}/v2/feed/comments`, {
        params: next || {
          feed_id: feedId,
          count: CountPerPage,
          start_id: 0,
          order: 'desc'
        }
      }).then(r => {
        let comments = r.body.items
        comments = comments.map(u2l.comment)
        if (!next) {
          xsq.store.commentList = []
        }
        xsq.store.commentList = xsq.store.commentList.concat(comments)
        return r
      })
    },
    listRecvComment (store, next, mapper = i => i) {
      return $http.get(`${urlRoot}/v2/user/comments/received`, {
        params: next || {
          count: CountPerPage,
          start_id: 0
        }
      }).then(r => {
        let comments = r.body.items
        comments = comments.map(u2l.mycomment).map(mapper)
        if (!next) {
          store.list = []
        }
        store.list = store.list.concat(comments)
        return r
      })
    },
    listSentComment (store, next, mapper = i => i) {
      return $http.get(`${urlRoot}/v2/user/comments/sent`, {
        params: next || {
          count: CountPerPage,
          start_id: 0
        }
      }).then(r => {
        let comments = r.body.items
        comments = comments.map(u2l.mycomment).map(mapper)
        if (!next) {
          store.list = []
        }
        store.list = store.list.concat(comments)
        return r
      })
    },
    listLikeme (store, next, mapper = i => i) {
      return $http.get(`${urlRoot}/v2/user/likes/received`, {
        params: next || {
          count: CountPerPage,
          start_id: 0
        }
      }).then(r => {
        let comments = r.body.items
        comments = comments.map(u2l.mycomment).map(mapper)
        if (!next) {
          store.list = []
        }
        store.list = store.list.concat(comments)
        return r
      })
    },
    likeFeed (feedId) {
      return $http.post(`${urlRoot}/v2/feed/like`, {feed_id: feedId})
    },
    unlikeFeed (feedId) {
      return $http.delete(`${urlRoot}/v2/feed/like`, {
        body: {feed_id: feedId}
      })
    },
    favFeed (feedId) {
      return $http.post(`${urlRoot}/v2/feed/favourite`, {feed_id: feedId})
    },
    unfavFeed (feedId) {
      return $http.delete(`${urlRoot}/v2/feed/favourite`, {
        body: {feed_id: feedId}
      })
    },
    sendFeed (tid, content, anonymous = false, imageUrls = []) {
      return $http.post(`${urlRoot}/v2/feed/`, {
        content: content,
        custom: JSON.stringify({
          a: anonymous ? 1 : 0
        }),
        img_str: imageUrls.join(';'),
        topic_ids: tid,
        type: 0 // 0普通 1公告
      })
    },
    deleteFeed (feedId) {
      return $http.delete(`${urlRoot}/v2/feed/`, {
        body: {feed_id: feedId}
      }).then(r => {
        let list = xsq.store.feedList
        for (let i of list) {
          if (i.id === feedId) {
            list.splice(i, 1)
            console.log('delete this ', i)
          }
        }
      })
    },
    sendComment (content, feed, anonymous = false, replyComment = null) {
      const feedId = feed.id
      let replyUid = feed.creator.id
      let replyCommentId = null
      if (replyComment) {
        replyUid = replyComment.creator.id
        replyCommentId = replyComment.id
      }
      return $http.post(`${urlRoot}/v2/feed/comment`, {
        content: content,
        custom: JSON.stringify({
          a: anonymous ? 1 : 0
        }),
        feed_id: feedId,
        reply_uid: replyUid, // 大概是提醒用的?
        reply_comment_id: replyCommentId
      })
    },
    deleteComment (feedId, commentId) {
      return $http.delete(`${urlRoot}/v2/feed/comment`, {
        body: {
          feed_id: feedId,
          comment_id: commentId
        }
      }).then(r => {
        let list = xsq.store.commentList
        for (let i of list) {
          if (i.id === commentId) {
            list.splice(i, 1)
            console.log('delete this ', i)
          }
        }
      })
    },
    uploadToken () {
      // r.token = 'UPLOAD_AK_TOP XXXXXX...'
      return $http.get(`${urlRoot}/v2/user/upload_image`)
    },
    uploadImages (images) {
      if (images.length === 0) return
      let token = null
      return xsq.uploadToken()
        .then(r => {
          token = r.token
          let all = []
          for (let img of images) {
            let formData = new FormData()
            formData.append('name', uuid.v4())
            formData.append('size', img.size)
            formData.append('content', img)
            let promise = $http.post('http://upload.wsq.umeng.com/api/proxy/upload', formData, {
              headers: {
                'Authorization': token
              }
            }).then(r => {
              if (r.body.code === 'OK') {
                return r.body.url
              } else {
                throw new Error('上传图片失败')
              }
            })
            all.push(promise)
          }
          return Promise.all(all)
        })
    },
    uploadAvatar (avatar) {
      return xsq.uploadImages([avatar])
        .then(r => $http.put(`${urlRoot}/v2/user/icon`, {
          icon_url_str: r[0]
        }))
    }
  }
  Object.keys(xsq).forEach(key => {
    if (['store', 'init', 'deps', 'login', 'uploadImages'].includes(key)) return
    let old = xsq[key]
    if (typeof old !== 'function') return
    xsq[key] = function () {
      return Promise.resolve().then(() => before(key)).then(() => old.apply(xsq, arguments)).then(after)
    }
  })
  return xsq
}
