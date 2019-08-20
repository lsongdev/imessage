const iMessage = require('..');

const im = new iMessage();

(async () => {

  const messages = await im.getMessages();
  console.log(messages);

})();