## apple-imessage [![apple-imessage](https://img.shields.io/npm/v/apple-imessage.svg)](https://npmjs.org/apple-imessage)

> Apple iMessage

### Installation

```bash
$ npm install apple-imessage
```

### Example

```js
const iMessage = require('apple-imessage');

const im = new iMessage();

(async () => {

  const messages = await im.getMessages();
  console.log(messages);

})();
```

### Contributing
- Fork this Repo first
- Clone your Repo
- Install dependencies by `$ npm install`
- Checkout a feature branch
- Feel free to add your features
- Make sure your features are fully tested
- Publish your local branch, Open a pull request
- Enjoy hacking <3

### MIT

This work is licensed under the [MIT license](./LICENSE).

---