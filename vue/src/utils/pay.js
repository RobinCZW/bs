export function alipay (payinfo) { // 支付宝支付接口
  return new Promise((resolve, reject) => {
    if (window.cordova) {
      window.cordova.plugins.AliPay.pay(payinfo, e => {
        resolve(e)
      }, e => {
        switch (e.resultStatus) {
          case 4000:
            reject('订单支付失败')
            return
          case 6001:
            reject('订单被取消')
            return
          case 6002:
            reject('网络出错')
            return
        }
        reject('其他错误')
      })
    } else {
      reject('调用支付宝失败')
    }
  })
}
