# unipass-js-sdk

[English Document](readme.md)

安装

```
yarn add unipass-js-sdk
// 或
npm install unipass-js-sdk --save
```

引入

```js
import unipass from 'unipass-js-sdk'
```

文档：https://unipass.gitbook.io/docs/dev-info/connect-unipass

演示：https://t.unipass.xyz/demo

示例

### 初始化 init

```js
unipass.init('https://t.unipass.xyz', (ret) => {
  console.log('unipass_ret', ret)
  // 示例：处理登录返回值
  if (ret.info === 'login success') {
    this.provider = ret.data
  }
})
// init 后可以读取本地缓存的账号
this.provider = unipass.provider
```

### 登录 login

- 返回值在初始化 init 的回调函数中

URL 网页跳转 方式

```js
unipass.login()
```

Popup 页面弹窗 方式

```js
unipass.popupLogin()
```

### 签名 sign

- 必须在登录后才可以签名
- 返回值在初始化 init 的回调函数中

URL 网页跳转 方式

```js
unipass.sign({ message: 'demo' })
```

Popup 页面弹窗 方式

```js
unipass.popupSign({ message: 'demo' })
```
