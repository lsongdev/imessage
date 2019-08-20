const path = require('path');
const sqlite3 = require('sqlite3');
const EventEmitter = require('events');

const getUserHome = () => {
  var envVar = (process.platform == 'win32') ? 'USERPROFILE' : 'HOME';
  return process.env[envVar];
};

const sqlite = filename => new Promise((resolve, reject) => {
  const db = new sqlite3.Database(filename, sqlite3.OPEN_READONLY, err => {
    if (err) return reject(err);
    resolve(db);
  });
});

const Q = fn => new Promise((resolve, reject) =>
  fn((err, res) => {
    if (err) return reject(err);
    resolve(res);
  })
);

const HOME = getUserHome();

class iMessage extends EventEmitter {
  constructor(options) {
    super();
    Object.assign(this, {
      path: iMessage.DB_PATH
    }, options);
    this.db = sqlite(this.path);
    return this;
  }
  connect() {
    return this.db;
  }
  async getRecipients(filter) {
    var where = "";
    // Maybe dangerous, check SQLlite doc
    if (filter && filter != "") where = " WHERE id LIKE '%" + filter + "%'";
    return db.all("SELECT * FROM `handle`" + where);
  }
  async getRecipientById(id, details) {
    const recipient = await Q(cb => db.get("SELECT * FROM `handle` WHERE ROWID = $id", {
      $id: id
    }, cb));
    if (details === true) recipient.messages = await Q(cb => db.all("SELECT * FROM `message` WHERE handle_id = $id", {
      $id: id
    }, cb));
    return recipient;
  }
  async getMessages(filter, details) {
    const db = await this.connect();
    var where = "";
    var join = "";
    // Maybe dangerous, check SQLlite doc
    if (filter && filter != "") where = " WHERE `message`.text LIKE '%" + filter + "%'";
    if (details) join = " JOIN `handle` ON `handle`.ROWID = `message`.handle_id";
    return Q(cb => db.all("SELECT * FROM `message`" + join + where, cb));
  }
  async getMessagesFromId() {
    return Q(cb => db.all("SELECT * FROM `message` WHERE handle_id = $id" + where, {
      $id: id
    }, cb));
  }
  async getAttachmentsFromId() {
    return Q(cb => db.all("SELECT * FROM `message` \
      INNER JOIN `message_attachment_join` \
      ON `message`.ROWID = `message_attachment_join`.message_id \
      INNER JOIN `attachment` \
      ON `attachment`.ROWID = `message_attachment_join`.attachment_id \
      WHERE `message`.handle_id = $id", {
      $id: id
    }), cb);
  }
  async getAttachmentById() {
    return Q(cb => db.all("SELECT * FROM `message_attachment_join` \
    INNER JOIN `message` \
    ON `message`.ROWID = `message_attachment_join`.message_id \
    INNER JOIN `attachment` \
    ON `attachment`.ROWID = `message_attachment_join`.attachment_id", cb));
  }
}

iMessage.DB_PATH = path.join(HOME, '/Library/Messages/chat.db');;

module.exports = iMessage;