let installed = false
function pad0 (s) {
  s = s.toString()
  return s.length === 1 ? '0' + s : s
}
export default (services) => ({
  install (Vue, options) {
    if (installed) {
      return
    }
    installed = true

    Vue.filter('friendlyTime', (time) => {
      let dayDiff = (d1, d2) => {
        const dayMs = 24 * 60 * 60 * 1000
        d1 = Math.floor((d1.getTime() - d1.getTimezoneOffset() * 60 * 1000) / dayMs)
        d2 = Math.floor((d2.getTime() - d2.getTimezoneOffset() * 60 * 1000) / dayMs)
        return d1 - d2
      }
      let now = services.utils.now
      let dif = Math.round((now.getTime() - time.getTime()) / 1000)
      let dy = now.getYear() - time.getYear()
      let dd = dayDiff(now, time)
      let td = pad0(time.getHours()) + ':' + pad0(time.getMinutes())
      let date = (time.getMonth() + 1) + '-' + time.getDate()
      const min = 60
      const hour = min * 60
      const day = hour * 24
      const ddTable = ['今天', '昨天', '前天']

      if (dif > 0) {
        if (dif < min) {
          return '刚刚'
        } else if (dif < hour) {
          return Math.round(dif / 60) + ' 分钟前'
        } else if (dif < day) {
          let h = Math.round(dif / 60 / 60)
          if (h < 3) {
            return `${h} 小时前`
          } else {
            return ddTable[dd] + ' ' + td
          }
        } else if (dd < 3) {
          return ddTable[dd] + ' ' + td
        } else if (dy === 0) {
          return date + ' ' + td
        }
      }

      return time.getFullYear() + '-' + date + ' ' + td
    })
  }
})
