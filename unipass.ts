// unipass.ts
const { createHash } = require('crypto')

declare interface Window {
  unipass: any
  unipassIsBindEvent: any
}

declare interface Ret {
  code: number
  info: string
  data: {
    email: string
    pubkey: string
  }
}

declare interface Provider {
  email: string
  pubkey: string
}

;(function (factory) {
  // nodejs
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory()
  }
  // browser
  if (typeof window !== 'undefined') {
    window.unipass = factory()
  }
})(function () {
  const Sea = {
    // json parse
    json(s: string) {
      try {
        return JSON.parse(s)
      } catch (err) {
        return s
      }
    },
    // Local storage
    localStorage(key: string, val?: any) {
      if (val === undefined) {
        return this.json(window.localStorage.getItem(key) as string)
      } else if (val === '') {
        window.localStorage.removeItem(key)
      } else {
        window.localStorage.setItem(key, JSON.stringify(val))
      }
    },
    params(key: string, value?: string) {
      const obj = new window.URL(window.location.href)
      if (value) {
        obj.searchParams.set(key, value)
      } else if (value === '') {
        obj.searchParams.delete(key)
      } else if (key) {
        return obj.searchParams.get(key)
      } else {
        return obj.searchParams
      }
      history.replaceState({}, '', obj.href)
    },
  }
  const _callbackRet = function (ret: Ret) {
    if (ret && ret.data && ret.code) {
      if (Sea.params('unipass_ret')) {
        Sea.params('unipass_ret', '')
      }
      unipass.callback(ret)
      if (ret.info === 'login success') {
        Sea.localStorage('unipass_provider', ret.data)
        unipass.provider = ret.data
      }
    }
  }
  const _jump = function (type: string, data = {} as any) {
    if (type === 'sign') {
      const pubkey = unipass.provider.pubkey
      if (pubkey) {
        data.pubkey = pubkey
      } else {
        console.error('Please login first')
        return
      }
      // handle message
      if (data.message) {
        if (data.type !== 'personal_sign') {
          data.message = createHash('SHA256')
            .update(data.message)
            .digest('hex')
            .toString()
        }
      } else {
        console.error('Please enter message')
        return
      }
    }
    data.success_url = encodeURIComponent(window.location.href)
    const query = Object.keys(data)
      .map((key) => `${key}=${data[key]}`)
      .join('&')
    const url = `${unipass.url}/${type}?${query}`
    window.location.href = url
  }
  const _popup = function (type: string, data = {} as any) {
    if (unipass.isBuiltInBrowser()) {
      console.error(
        'Popup Window is not supported by low compatibility browser',
      )
      return
    }
    if (type === 'sign') {
      const pubkey = unipass.provider.pubkey
      if (pubkey) {
        data.pubkey = pubkey
      } else {
        console.error('Please login first')
        return
      }
      // handle message
      if (data.message) {
        if (data.type !== 'personal_sign') {
          data.message = createHash('SHA256')
            .update(data.message)
            .digest('hex')
            .toString()
        }
      } else {
        console.error('Please enter message')
        return
      }
    }
    const page = window.open(
      `${unipass.url}/${type}`,
      type,
      'width=380,height=675,top=40,left=100,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,',
    )
    if (page) {
      page.onload = () => {
        data.success_url = 'open'
        page.postMessage(data, '*')
      }
    }
  }
  const unipass = {
    callback(_ret: Ret) {},
    url: 'https://t.unipass.xyz',
    provider: {} as Provider,
    init(baseUrl: string | null, callback: (ret: Ret) => void) {
      if (typeof window === 'undefined' || window.unipassIsBindEvent) {
        return
      }
      this.callback = callback
      if (baseUrl) {
        this.url = baseUrl
      }
      window.unipassIsBindEvent = true
      const url = new URL(window.location.href)
      const ret = Sea.json(url.searchParams.get('unipass_ret') as string)
      if (ret) {
        _callbackRet(ret)
      }
      window.addEventListener(
        'message',
        (event: MessageEvent) => {
          const ret = event.data
          _callbackRet(ret)
        },
        false,
      )
      unipass.provider = Sea.localStorage('unipass_provider') || {}
    },
    login() {
      _jump('login')
    },
    sign(data = {} as any) {
      _jump('sign', data)
    },
    popupLogin() {
      _popup('login')
    },
    popupSign(data = {} as any) {
      _popup('sign', data)
    },
    exit() {
      Sea.localStorage('unipass_provider', '')
      window.location.reload()
    },
    isBuiltInBrowser() {
      if (typeof navigator === 'undefined') {
        return true
      }
      const userAgent = navigator.userAgent.toLowerCase()
      const list = ['micromessenger', 'qqbrowser', 'weibo', 'alipay']
      for (const browser of list) {
        if (userAgent.includes(browser)) {
          return true
        }
      }
      return false
    },
  }
  return unipass
})
