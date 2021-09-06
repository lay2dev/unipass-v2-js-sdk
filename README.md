# unipass-js-sdk

[中文文档](README.zh.md)

install

```
yarn add unipass-js-sdk
// or
npm install unipass-js-sdk --save
```

introduce

```js
import unipass from 'unipass-js-sdk'
```

Documentation: https://unipass.gitbook.io/docs/dev-info/connect-unipass

Demonstration: https://t.unipass.xyz/demo

Example

### init

```js
unipass.init('https://t.unipass.xyz', (ret) => {
  console.log('unipass_ret', ret)
  // Example: Processing login return values
  if (ret.info === 'login success') {
    this.provider = ret.data
  }
})
// After init, you can read the account in the local cache
this.provider = unipass.provider
```

### login

- The return value is in the init callback function

Page Jump mode

```js
unipass.login()
```

Page pop-up mode

```js
unipass.popupLogin()
```

### sign

- You must sign in before you can sign
- The return value is in the init callback function

Page Jump mode

```js
unipass.sign({ message: 'demo' })
```

Page pop-up mode

```js
unipass.popupSign({ message: 'demo' })
```
