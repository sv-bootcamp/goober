const config = require('./config/default.json');
const levelup = require('levelup');

const Commands = {
  db: levelup(config.database, {valueEncoding: 'json'}),
  db_get_all: function(prefix = '') {
    this.db.createReadStream({
      start: `${prefix}\x00`,
      end: `${prefix}\xFF`
    })
    .on('data', console.log)
    .on('error', console.log);
  },
  db_get: function(key) {
    this.db.get(key, function (err, value) {
      if (err) return console.log(err);
      return console.log(value);
    });
  },
  db_del: function(key) {
    this.db.del(key, function (err) {
      if (err) return console.log(err);
      return console.log(`Removed ${key}`);
    });
  }
};

var command = process.argv[2];
var arg = process.argv[3];

console.log(`# Execute command with argument
command : ${command}
argument : ${arg}

`);

Commands[command](arg);