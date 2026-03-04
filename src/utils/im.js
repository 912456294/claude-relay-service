const axios = require('axios')
const crypto = require('crypto')

const apiUrl = 'https://im-openapi.dcloud.net.cn/http/uni-im-robot/'

const GROUPS = {
  test: '69a792e02fb91cbc1dbedb36' // 测试内容发送
}

async function sendMessage({ message, group = 'test', type = 'text' } = {}) {
  const params = {
    group_id: GROUPS[group] || group,
    body: message
  }
  params.type = type
  console.log('params', params)

  const res = await axios.post(`${apiUrl}sendMessage`, [params, getSign(params)], {
    headers: {
      'Content-Type': 'application/json'
    },
    timeout: 10000
  })

  console.log('im sendMessage res', res.data)
  return res.data
}

function getSign(params, signPrivateKey = 'dcloud_._A_A_._json@9527') {
  const keys = Object.keys(params)
  keys.sort()
  let signStr = ''
  for (let i = 0; i < keys.length; i++) {
    if (
      params[keys[i]] &&
      (typeof params[keys[i]] === 'object' || Array.isArray(params[keys[i]]))
    ) {
      signStr += `${keys[i]}=${JSON.stringify(params[keys[i]])}`
    } else if (params[keys[i]] === undefined) {
      continue
    } else {
      signStr += `${keys[i]}=${params[keys[i]] === null ? '' : params[keys[i]]}`
    }
    if (i < keys.length - 1) {
      signStr += '&'
    }
  }
  signStr += signPrivateKey
  let sign = crypto.createHash('sha256').update(signStr).digest('hex')
  sign = sign.toUpperCase()
  return sign
}

module.exports = {
  sendMessage
}
